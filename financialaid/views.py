"""
Views from financialaid
"""
import json

from django.conf import settings
from django.views.generic import ListView
from rest_framework.authentication import SessionAuthentication
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import IsAuthenticated

from financialaid.models import FinancialAid, FinancialAidStatus
from financialaid.serializers import FinancialAidSerializer
from ui.views import get_bundle_url


class IncomeValidationView(CreateAPIView):
    """
    View for income validation API. Takes income and currency, then determines whether review
    is necessary, and if not, sets the appropriate tier for personalized pricing.
    """
    serializer_class = FinancialAidSerializer
    authentication_classes = (SessionAuthentication, )
    permission_classes = (IsAuthenticated, )


class ReviewFinancialAidView(ListView):
    """
    View for reviewing financial aid requests.
    """
    paginate_by = 10
    context_object_name = "financial_aid_objects"
    template_name = "review_financial_aid.html"
    selected_status = None  # Used to modify queryset and in context

    def get_context_data(self, **kwargs):
        """
        Gets context for view
        """
        context = super().get_context_data(**kwargs)
        context["selected_status"] = self.selected_status
        # Create ordered list of (financial aid status, financial message)
        messages = FinancialAidStatus.STATUS_MESSAGES_DICT
        message_order = (
            FinancialAidStatus.PENDING_MANUAL_APPROVAL,
            FinancialAidStatus.APPROVED,
            FinancialAidStatus.REJECTED,
            FinancialAidStatus.AUTO_APPROVED
        )
        context["financial_aid_statuses"] = (
            (status, "Show: {message}".format(message=messages[status]))
            for status in message_order
        )
        # Required for styling
        context["style_src"] = get_bundle_url(self.request, "style.js")
        context["dashboard_src"] = get_bundle_url(self.request, "dashboard.js")
        js_settings = {
            "gaTrackingID": settings.GA_TRACKING_ID,
            "reactGaDebug": settings.REACT_GA_DEBUG,
            "authenticated": not self.request.user.is_anonymous(),
            "edx_base_url": settings.EDXORG_BASE_URL,
        }
        context["js_settings_json"] = json.dumps(js_settings)
        return context

    def get_queryset(self):
        """
        Gets queryset for ListView to return to view
        """
        self.selected_status = self.kwargs.get("status", None)
        if self.selected_status is None or self.selected_status not in FinancialAidStatus.ALL_STATUSES:
            self.selected_status = FinancialAidStatus.PENDING_MANUAL_APPROVAL
        return FinancialAid.objects.filter(status=self.selected_status)
