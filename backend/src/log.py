import loguru

logger = loguru.logger


if __name__ == "__main__":
    logger.debug_model('info test')
    logger.info_app('info test')