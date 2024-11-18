from openai import OpenAI
import os
from dotenv import load_dotenv
from log import logger
load_dotenv()
TOKEN = os.getenv("GPT4ALL_TOKEN")


def generate_text(prompt: str) -> str:

    try:
        client = OpenAI(api_key=TOKEN, base_url="https://api.gpt4-all.xyz/v1")

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            stream=False,
        )

        result = response.choices[0].message.content
        return result
    except Exception as e:
        logger.exception(e)
        return None


def generate_image(prompt: str) -> str:
    try:
        client = OpenAI(api_key=TOKEN, base_url="https://api.gpt4-all.xyz/v1")
        response = client.images.generate(
            model="dall-e-3",
            prompt=prompt,
        )
        url = response.data[0].url
        return url
    except Exception as e:
        logger.exception(e)
        return None





if __name__ == "__main__":
    print(generate_text("hi"))
    print(generate_image("cat"))
    # client = OpenAI(api_key=TOKEN, base_url="https://api.gpt4-all.xyz/v1")
    # client.models.list()
