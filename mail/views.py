"""
Views for email REST APIs
"""
import logging

from rest_framework import (
    authentication,
    permissions,
    status,
)
from rest_framework.views import APIView
from rest_framework.response import Response

from search.api import (
    prepare_and_execute_search,
    get_all_query_matching_emails
)
from mail.api import MailgunClient
from mail.permissions import UserCanMessageLearnersPermission


log = logging.getLogger(__name__)


class MailView(APIView):
    """
    View class that authenticates and handles HTTP requests to mail API URLs
    """
    authentication_classes = (authentication.SessionAuthentication, )
    permission_classes = (permissions.IsAuthenticated, UserCanMessageLearnersPermission, )

    def post(self, request, *args, **kargs):  # pylint: disable=unused-argument, no-self-use
        """
        View  to send emails to users
        """
        emails = prepare_and_execute_search(
            request.user,
            search_param_dict=request.data.get('search_request'),
            search_func=get_all_query_matching_emails
        )
        mailgun_responses = MailgunClient.send_batch(
            subject=request.data['email_subject'],
            body=request.data['email_body'],
            recipients=emails
        )
        return Response(
            status=status.HTTP_200_OK,
            data={
                "batch_{}".format(batch_num): {
                    "status_code": resp.status_code,
                    "data": resp.json()
                } for batch_num, resp in enumerate(mailgun_responses)
            }
        )
