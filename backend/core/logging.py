def setup_logging():
    import logging
    import os

    root_level = os.environ.get("PROD", logging.INFO)

    logging_config = {
        "version": 1,
        "disable_existing_loggers": False,
        "formatters": {
            "access": {
                "()": "uvicorn.logging.AccessFormatter",
                "fmt": "%(asctime)s %(levelprefix)s %(request_line)s %(status_code)s",
                "datefmt": "%Y-%m-%d %H:%M:%S",
                "use_colors": True,
            },
            "default": {
                "()": "uvicorn.logging.DefaultFormatter",
                "fmt": "%(asctime)s %(levelprefix)s [%(name)s].%(funcName)s() - %(message)s",
                "datefmt": "%Y-%m-%d %H:%M:%S",
                "use_colors": True,
            },
        },
        "handlers": {
            "access": {
                "formatter": "access",
                "class": "logging.StreamHandler",
                "stream": "ext://sys.stdout",
            },
            "default": {
                "formatter": "default",
                "class": "logging.StreamHandler",
                "stream": "ext://sys.stdout",
            },
        },
        "loggers": {
            "": {
                "handlers": ["default"],
                "level": logging.INFO,
                "propagate": False,
            },
            "uvicorn": {
                "handlers": ["default"],
                "level": logging.INFO,
                "propagate": True,
            },
            "uvicorn.access": {
                "handlers": ["access"],
                "level": logging.INFO,
                "propagate": False,
            },
            "uvicorn.error": {
                "level": logging.INFO,
                "handlers": ["default"],
                "propagate": False,
            },
        },
    }

    logging.config.dictConfig(logging_config)