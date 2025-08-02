"""
Gemini LLM service for final fallback when both KB and MCP have low confidence.
"""
import os
import re
import structlog
import google.generativeai as genai
from typing import Dict, Optional

logger = structlog.get_logger()


class GeminiService:
    """Service for interacting with Google Gemini 2.5 Pro."""
    
    def __init__(self):
        """Initialize Gemini service."""
        self.api_key = os.getenv("GEMINI_API_KEY")
        if not self.api_key:
            logger.warning("GEMINI_API_KEY not found in environment variables")
            self.client = None
            return
            
        try:
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel('gemini-2.0-flash-exp')
            logger.info("Gemini service initialized successfully")
        except Exception as e:
            logger.error("Failed to initialize Gemini service", error=str(e))
            self.client = None
    
    async def solve_math_problem(self, question: str) -> Dict[str, any]:
        """
        Solve a math problem using Gemini 2.5 Pro.
        
        Args:
            question: The math question to solve
            
        Returns:
            Dict containing the solution and metadata
        """
        if not self.model:
            raise Exception("Gemini service not properly initialized")
        
        try:
            # Create a comprehensive prompt for math problem solving
            prompt = self._create_math_prompt(question)
            
            logger.info("Sending request to Gemini", question_length=len(question))
            
            # Generate response
            response = await self._generate_response(prompt)
            
            # Parse and validate the response
            result = self._parse_response(response, question)
            
            logger.info("Gemini response generated successfully", 
                       answer_length=len(result.get("answer", "")))
            
            return result
            
        except Exception as e:
            logger.error("Error in Gemini math problem solving", error=str(e))
            raise
    
    def _create_math_prompt(self, question: str) -> str:
        """Create a comprehensive prompt for math problem solving."""
        return f"""You are an expert mathematics tutor. Solve this math problem with precision and clarity.

QUESTION: {question}

CRITICAL FORMATTING REQUIREMENT - THIS IS MANDATORY:
You MUST wrap every single mathematical expression in dollar signs ($). No exceptions.

RESPONSE FORMAT:
Solution Steps:
[Provide numbered steps with clear explanations]

Final Answer:
[State the final answer clearly and concisely]

Verification (if applicable):
[Show verification using an alternative method or substitution]

MANDATORY MATH FORMATTING EXAMPLES - COPY THIS STYLE EXACTLY:
- Write: "For the term $3x^2$, we have $a = 3$ and $n = 2$"
- Write: "The function $f(x) = 3x^2 + 2x - 1$"
- Write: "The derivative is $f'(x) = 6x + 2$"
- Write: "Apply the power rule: if $f(x) = ax^n$, then $f'(x) = nax^{{n-1}}$"

NEVER WRITE MATH WITHOUT DOLLAR SIGNS:
- WRONG: "For the term 3x^2, we have a = 3 and n = 2"
- WRONG: "The function f(x) = 3x^2 + 2x - 1"
- WRONG: "The derivative is f'(x) = 6x + 2"

EVERYTHING mathematical must have $ around it: variables, numbers in math context, equations, expressions.

Begin your solution now, remembering to wrap ALL math in $ signs:"""
    
    async def _generate_response(self, prompt: str) -> str:
        """Generate response from Gemini."""
        try:
            # Generate content using the configured model
            response = self.model.generate_content(prompt)
            
            if not response.text:
                raise Exception("Empty response from Gemini")
            
            return response.text
            
        except Exception as e:
            logger.error("Error generating Gemini response", error=str(e))
            raise
    
    def _parse_response(self, response: str, original_question: str) -> Dict[str, any]:
        """Parse Gemini response into structured format."""
        try:
            # Clean up the response
            cleaned_response = self._clean_response(response)
            
            return {
                "answer": cleaned_response,
                "confidence": 0.85,  # Increased confidence for better structured responses
                "source": "Gemini",
                "original_question": original_question,
                "response_length": len(cleaned_response),
                "model": "gemini-2.0-flash-exp"
            }
            
        except Exception as e:
            logger.error("Error parsing Gemini response", error=str(e))
            return {
                "answer": response.strip(),
                "confidence": 0.6,
                "source": "Gemini",
                "original_question": original_question,
                "error": "Failed to parse response properly"
            }
    
    def _clean_response(self, response: str) -> str:
        """Clean and format the Gemini response."""
        try:
            # Remove excessive introductory phrases
            response = response.strip()
            
            # Remove common verbose openings
            verbose_openings = [
                "Okay, let's",
                "Alright, let's", 
                "Sure, let's",
                "Let's solve",
                "I'll solve",
                "Here's how to"
            ]
            
            for opening in verbose_openings:
                if response.lower().startswith(opening.lower()):
                    # Find the first period or newline and start from there
                    first_break = min(
                        response.find('.') + 1 if response.find('.') != -1 else len(response),
                        response.find('\n') if response.find('\n') != -1 else len(response)
                    )
                    response = response[first_break:].strip()
                    break
            
            # Convert LaTeX delimiters to standard format for frontend
            response = response.replace('\\(', '$').replace('\\)', '$')
            response = response.replace('\\[', '$$').replace('\\]', '$$')
            
            # Remove markdown formatting
            response = response.replace("**Final Answer:**", "Final Answer:")
            response = response.replace("**Final Answer**", "Final Answer:")
            response = response.replace("## Final Answer", "Final Answer:")
            response = response.replace("## Solution Steps", "Solution Steps:")
            response = response.replace("## Verification", "Verification:")
            
            # Clean up excessive asterisks and markdown formatting
            response = re.sub(r'\*{2,}', '', response)  # Remove all ** formatting
            response = re.sub(r'#{2,}\s*', '', response)  # Remove ## headers
            
            # Improve section formatting
            response = re.sub(r'^(\d+\.\s)', r'\n\1', response, flags=re.MULTILINE)  # Add newlines before numbered steps
            response = re.sub(r'\n\s*\n\s*\n', '\n\n', response)  # Remove excessive line breaks
            
            return response.strip()
            
        except Exception as e:
            logger.warning("Failed to clean response, returning original", error=str(e))
            return response.strip()
    
    def is_available(self) -> bool:
        """Check if Gemini service is available."""
        return self.model is not None
    
    async def health_check(self) -> Dict[str, any]:
        """Perform a health check on the Gemini service."""
        if not self.model:
            return {
                "status": "unhealthy",
                "error": "Gemini service not initialized"
            }
        
        try:
            # Test with a simple math problem
            test_response = await self.solve_math_problem("What is 2 + 2?")
            
            return {
                "status": "healthy",
                "model": "gemini-2.0-flash-exp",
                "test_response_length": len(test_response.get("answer", "")),
                "api_key_configured": bool(self.api_key)
            }
            
        except Exception as e:
            return {
                "status": "unhealthy",
                "error": str(e),
                "api_key_configured": bool(self.api_key)
            }
