"""
Views from financialaid
"""
from django.contrib.auth.models import User
from rest_framework.authentication import SessionAuthentication
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from financialaid.serializers import FinancialAidSerializer


class IncomeValidationView(APIView):
    """
    View for income validation API. Takes income and currency, then determines whether review
     is necessary, and if not, sets the appropriate tier for personalized pricing.
    """
    serializer_class = FinancialAidSerializer
    authentication_classes = (SessionAuthentication, )
    permission_classes = (IsAuthenticated, )

    def post(self, request, *args, **kwargs):

        currency = request.data('currency')
        program = request.data('program')

        #TODO: Add currency conversion here.
        if currency != "USD":
            raise ValidationError("Only USD supported currently")

        if request.user not in User.objects.filter(programenrollment__program=program):
            raise ValidationError("User not in program")

        # check user is enrolled in program
        # check that the program has financial aid enabled



        # 1. convert income to USD
        # 2. check country income thresholds
        # 3. does it need review?
        # 4. if not, what tier?


        # country to income
        # country to currency





