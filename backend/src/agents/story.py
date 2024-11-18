from llm.openai import generate_text
from llm.sd import generate_image


def generate_story(date: str, theme: str) -> str:
    prompt = f"""
You are an excellent science fiction storyteller. Your task is to generate an engaging short story based on the given time and theme.

## Input Time
{date}
## Input Theme
{theme}

## Constraints
- The story should be no more than 100 words in length.    
- from first person perspective
"""
    return generate_text(prompt)

def generate_story_image(content: str) -> str:
    prompt = f"""
    {content}
    
    ## Style: 
    Surrealism, Digital Art, Cyberpunk
    """
    return generate_image(prompt)


if __name__ == "__main__":
    content = generate_story("2020-11-14", "living in an automated home")
    print(generate_story_image(content))
