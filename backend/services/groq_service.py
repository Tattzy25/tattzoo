"""
GroqService: Chat completions for tattoo ideas using Groq

Implements the exact system prompt and message format provided,
with streaming accumulation to return a single content string.
"""
from typing import Tuple, Dict, Optional

from groq import Groq
from config.settings import settings


IDEAS_SYSTEM_PROMPT = (
    "Invent a unique, realistic tattoo idea inspired only by authentic real-life situations, moments, or experiences, grounded fully in the life journey, struggle, or pivotal event of a hypothetical (or user-described) person. For every idea, base your response strictly on plausible lived moments—never use symbols, metaphors, abstract shapes, or indirect references. Your response must always be raw, unapologetic, and distinctly adult: avoid PG, PG-13, or childish ideas, and reject all formal or filtered language. Assume you’re sharing ideas in a brutally honest, informal conversation with a close friend, letting your creativity and realism run wild—don’t hold back or sanitize.\n\nIf the user supplies specific life details, base your tattoo idea precisely and exclusively on those facts, keeping everything literal and free of abstraction. Only reference a character or persona if the user requests it directly or provides explicit character details—otherwise, speak purely from the event or scenario.\n\n- Use only direct, literal, and realistic visual imagery drawn from everyday experience.\n- Don’t use or hint at symbolism, metaphor, abstract imagery, or fantasy—no exceptions, subtle or otherwise.\n- If multiple ideas are asked for or appropriate, reply with each as a separate, short, standalone paragraph.\n- Do not explain, justify, or elaborate—present each idea on its own.\n- Write every idea for an adult, unapologetic audience: never childish, censored, or indirectly phrased.\n\n# Output Format\n\n- Deliver each tattoo idea as a self-contained short paragraph of 1-2 sentences with zero preamble or explanation.\n- Use a blunt, real, and unfiltered tone—never formal, and never symbolic or abstract.\n- Ensure the tattoo concept is rooted directly in the supplied or plausible life experience, with no embellishment or inference beyond what’s realistic and true-to-life.\n\n# Examples\n\nExample output (based on a prompt about waking up early for years to support family):\n- A row of alarm clocks set to 4:30am, matching the time woken up for every shift, inked across the forearm.\n\n(Actual tattoo ideas should always be as direct, specific, and literal, matching the sordid and raw tone demanded. Longer ideas are acceptable when details warrant, but never expand into metaphor or interpretation. If the user provides adult or gritty life details, match that energy.)\n\n# Edge Cases and Important Considerations\n\n- Absolutely never use symbolism, metaphor, or abstraction, including subtle or veiled instances.\n- Never create childish, PG, or filtered ideas; your audience is unapologetically adult.\n- All tattoo imagery must be strictly literal and plausible from real experience.\n- If a specific person, name, or character is not supplied by the user, offer ideas based only on the given event or situation—never invent or reference personas.\n- If multiple tattoos are requested, write each as its own raw, concise paragraph.\n\n# Reminder\n\nYour fundamental objective is to generate realistic, literal, and direct tattoo ideas (one per paragraph), rooted in concrete, lived experiences or provided scenarios. Never use symbolism, metaphor, abstraction, childishness, or any filtered tone. If user details are given, use them literally; otherwise, invent ideas purely from plausible adult life situations. Respond always with unapologetic, blunt, concise descriptions."
)


class GroqService:
    def __init__(self) -> None:
        api_key: Optional[str] = None
        try:
            api_key = settings.GROQ_API_KEY.get_secret_value() if settings.GROQ_API_KEY else None
        except Exception:
            api_key = None
        self.client = Groq(api_key=api_key) if api_key else Groq()

    async def generate_ideas(self, text: str, selection_info: Optional[str] = None) -> Tuple[str, Dict[str, int], str]:
        """
        Generate tattoo ideas using Groq chat completions with streaming accumulation.

        Returns: (content, usage, model)
        """
        # Build messages exactly as provided, substituting final user content
        # Per product direction: always send one user sentence
        messages = [
            {"role": "system", "content": IDEAS_SYSTEM_PROMPT},
            {"role": "user", "content": "Give me a tattoo idea."},
        ]

        try:
            completion = self.client.chat.completions.create(
                model=settings.GROQ_MODEL,
                messages=messages,
                temperature=1,
                max_completion_tokens=65536,
                top_p=1,
                stream=True,
                stop=None,
            )

            content_parts: list[str] = []
            model = settings.GROQ_MODEL
            usage: Dict[str, int] = {"input_tokens": 0, "output_tokens": 0, "total_tokens": 0}

            for chunk in completion:
                try:
                    # Accumulate streaming delta content
                    delta = chunk.choices[0].delta
                    if delta and getattr(delta, "content", None):
                        content_parts.append(delta.content)
                    # Capture model/usage if present at the final chunk
                    if getattr(chunk, "model", None):
                        model = chunk.model or model
                    if getattr(chunk, "usage", None):
                        u = chunk.usage
                        usage = {
                            "input_tokens": getattr(u, "prompt_tokens", 0) or u.get("prompt_tokens", 0),
                            "output_tokens": getattr(u, "completion_tokens", 0) or u.get("completion_tokens", 0),
                            "total_tokens": getattr(u, "total_tokens", 0) or u.get("total_tokens", 0),
                        }
                except Exception:
                    # Be tolerant of partial chunks
                    continue

            content = "".join(content_parts).strip()
            return content, usage, model

        except Exception:
            # Propagate error; router will translate into 500
            raise

    async def enhance_text(self, text: str, selection_info: Optional[str] = None) -> Tuple[str, Dict[str, int], str]:
        """
        Enhance tattoo description text using Groq chat completions with streaming accumulation.

        Returns: (content, usage, model)
        """
        # Build messages: use shared enhance system prompt; include selection context if provided
        user_content = text if not selection_info else f"{text}\n\n[Selection context]\n{selection_info}"
        messages = [
            {"role": "system", "content": settings.ENHANCE_SYSTEM_PROMPT},
            {"role": "user", "content": user_content},
        ]

        try:
            completion = self.client.chat.completions.create(
                model=settings.GROQ_MODEL,
                messages=messages,
                temperature=1,
                max_completion_tokens=65536,
                top_p=1,
                stream=True,
                stop=None,
            )

            content_parts: list[str] = []
            model = settings.GROQ_MODEL
            usage: Dict[str, int] = {"input_tokens": 0, "output_tokens": 0, "total_tokens": 0}

            for chunk in completion:
                try:
                    delta = chunk.choices[0].delta
                    if delta and getattr(delta, "content", None):
                        content_parts.append(delta.content)
                    if getattr(chunk, "model", None):
                        model = chunk.model or model
                    if getattr(chunk, "usage", None):
                        u = chunk.usage
                        usage = {
                            "input_tokens": getattr(u, "prompt_tokens", 0) or u.get("prompt_tokens", 0),
                            "output_tokens": getattr(u, "completion_tokens", 0) or u.get("completion_tokens", 0),
                            "total_tokens": getattr(u, "total_tokens", 0) or u.get("total_tokens", 0),
                        }
                except Exception:
                    continue

            content = "".join(content_parts).strip()
            return content, usage, model

        except Exception:
            # Propagate error; router will translate into 500
            raise


# Global instance
groq_service = GroqService()