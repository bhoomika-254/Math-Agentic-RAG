"""
Guardrails service for input/output validation and safety.
"""
import re
import structlog
from typing import Dict, List, Any, Optional

logger = structlog.get_logger()

class GuardrailsService:
    """Service for input/output validation using guardrails-ai."""
    
    def __init__(self):
        """Initialize Guardrails service."""
        self.initialized = False
        self._setup_validation_rules()
        logger.info("Guardrails service initialized")
    
    def _setup_validation_rules(self):
        """Setup validation rules for math content."""
        # TODO: Implement actual guardrails-ai integration
        # For now, implement basic validation rules
        
        # Prohibited content patterns
        self.prohibited_patterns = [
            r'(?i)\b(hack|exploit|malicious|virus|attack)\b',
            r'(?i)\b(personal|private|confidential|secret)\b',
            r'(?i)\b(password|credit|social.*security)\b'
        ]
        
        # Math-related positive patterns
        self.math_patterns = [
            r'\b\d+\b',  # Numbers
            r'[+\-*/=()]',  # Math operators
            r'(?i)\b(solve|equation|function|derivative|integral|limit|sum|product)\b',
            r'(?i)\b(algebra|geometry|calculus|trigonometry|statistics|probability)\b',
            r'(?i)\b(theorem|proof|formula|solution|answer)\b'
        ]
        
        self.initialized = True
    
    def validate_input(self, question: str) -> str:
        """
        Validate and sanitize input question.
        
        Args:
            question: Input question to validate
            
        Returns:
            Validated and sanitized question
            
        Raises:
            ValueError: If input is invalid or unsafe
        """
        try:
            if not question or not question.strip():
                raise ValueError("Question cannot be empty")
            
            # Check length limits
            if len(question) > 2000:
                raise ValueError("Question too long (max 2000 characters)")
            
            if len(question) < 5:
                raise ValueError("Question too short (min 5 characters)")
            
            # Check for prohibited content
            for pattern in self.prohibited_patterns:
                if re.search(pattern, question):
                    logger.warning("Prohibited content detected in input",
                                 pattern=pattern)
                    raise ValueError("Input contains prohibited content")
            
            # Basic sanitization
            sanitized = question.strip()
            
            # Remove potential script injections
            sanitized = re.sub(r'<script.*?</script>', '', sanitized, flags=re.IGNORECASE | re.DOTALL)
            sanitized = re.sub(r'javascript:', '', sanitized, flags=re.IGNORECASE)
            
            # Check if it looks like a math question
            has_math_content = any(re.search(pattern, sanitized) for pattern in self.math_patterns)
            
            if not has_math_content:
                logger.info("Non-math content detected, proceeding with caution")
            
            logger.info("Input validation successful",
                       original_length=len(question),
                       sanitized_length=len(sanitized),
                       has_math_content=has_math_content)
            
            return sanitized
            
        except ValueError:
            raise
        except Exception as e:
            logger.error("Input validation failed", error=str(e))
            raise ValueError(f"Input validation error: {str(e)}")
    
    def validate_output(self, response: str) -> str:
        """
        Validate and sanitize output response.
        
        Args:
            response: Output response to validate
            
        Returns:
            Validated and sanitized response
            
        Raises:
            ValueError: If output is invalid or unsafe
        """
        try:
            if not response or not response.strip():
                return "No response generated"
            
            # Check length limits
            if len(response) > 10000:
                logger.warning("Response too long, truncating")
                response = response[:10000] + "... [truncated]"
            
            # Basic sanitization
            sanitized = response.strip()
            
            # Remove potential harmful content
            sanitized = re.sub(r'<script.*?</script>', '', sanitized, flags=re.IGNORECASE | re.DOTALL)
            sanitized = re.sub(r'javascript:', '', sanitized, flags=re.IGNORECASE)
            
            # Check for prohibited content in output
            for pattern in self.prohibited_patterns:
                if re.search(pattern, sanitized):
                    logger.warning("Prohibited content detected in output",
                                 pattern=pattern)
                    sanitized = re.sub(pattern, '[FILTERED]', sanitized, flags=re.IGNORECASE)
            
            logger.info("Output validation successful",
                       original_length=len(response),
                       sanitized_length=len(sanitized))
            
            return sanitized
            
        except Exception as e:
            logger.error("Output validation failed", error=str(e))
            return "Response validation failed - please try again"
    
    def is_math_related(self, text: str) -> bool:
        """
        Check if text is math-related.
        
        Args:
            text: Text to analyze
            
        Returns:
            True if text appears to be math-related
        """
        return any(re.search(pattern, text) for pattern in self.math_patterns)
