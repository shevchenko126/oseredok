import logging

import fastapi_mail.errors
from fastapi_mail import MessageSchema, FastMail, schemas
from starlette.background import BackgroundTasks

from core.config import settings
from schemas.notifications import NotificationAddSchema

logger = logging.getLogger(__name__)


# def generate_confirmation_code() -> str:
#     """Generate 16-characters alphanumeric confirmation code for email confirmation"""
#     code = secrets.token_urlsafe(16)
#     return code[:16]


def send_email_in_background(notification: NotificationAddSchema, background_tasks: BackgroundTasks):
    """Send email with content of the NotificationAddSchema in background"""
    message_schema = MessageSchema(
        recipients=[notification.email],
        subject=notification.subject,
        template_body=notification.dict(),
        subtype=schemas.MessageType.html,
    )
    # fm = FastMail(settings.email_conf)
    # fm.send_message(message_schema, 'email/templates/base.html')
    # print('1Sent email to: ' + str(message_schema.recipients) + ' with body: ' + str(notification.dict()))
    # background_tasks.add_task(fm.send_message, message_schema, 'email/templates/base.html')
    # print('2Sent email to: ' + str(message_schema.recipients) + ' with body: ' + str(notification.dict()))
    # logger.debug('3Sent email to: ' + str(message_schema.recipients) + ' with body: ' + str(notification.dict()))
    try:
        fm = FastMail(settings.email_conf)
        background_tasks.add_task(fm.send_message, message_schema, 'templates/base.html')
        logger.debug('Sent email to: ' + str(message_schema.recipients) + ' with body: ' + str(notification.dict()))
    except fastapi_mail.errors.ConnectionErrors as e:
        logger.error('Error sending email to: ' + str(message_schema.recipients) + ' with body: '
                     + str(notification.dict()))
        logger.error(e, stack_info=True, exc_info=True)


def create_notification(notification_in: NotificationAddSchema,
                        background_tasks: BackgroundTasks):
    """Create notification by schema and send email in background"""

    # can be used to save notification to db
    # db_obj = Notification(**notification_in.dict())
    # db.add(db_obj)
    # db.commit()
    # db.refresh(db_obj)

    send_email_in_background(notification_in, background_tasks)
    return