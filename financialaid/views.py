"""
Views from financialaid
"""
import json

from django.conf import settings
from django.views.generic import ListView
from django.views.generic.detail import SingleObjectMixin
from rest_framework.authentication import SessionAuthentication
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import IsAuthenticated

from financialaid.models import FinancialAidStatus, FinancialAid
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
    paginate_by = 10
    queryset = FinancialAid.objects.all()
    context_object_name = "financial_aid_objects"
    template_name = "review_financial_aid.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
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

# class ReviewFinancialAidView(ReactView):
#     """
#     View for users pages. This gets handled by the dashboard view like all other
#     React handled views, but we also want to return a 404 if the user does not exist.
#     """
#     def get(self, request, *args, **kwargs):
#         """
#         Handle GET requests
#         """
#         user = kwargs.pop('user')
#         if user is not None:
#             if not CanSeeIfNotPrivate().has_permission(request, self):
#                 raise Http404
#         elif request.user.is_anonymous():
#             # /users/ redirects to logged in user's page, but user is not logged in here
#             raise Http404
# 
#         return super(UsersView, self).get(request, *args, **kwargs)