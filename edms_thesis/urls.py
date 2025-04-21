from django.conf import settings
from django.urls import include, path
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions

api_info = openapi.Info(
    title="EDMS API",
    default_version="1.0.0",
    description="EDMS API documentation",
)

# Swagger Configuration
schema_view = get_schema_view(
    api_info, public=True, permission_classes=(permissions.AllowAny,)
)

urlpatterns = [
    path("api/auth/", include(("apps.user.urls", "auth"), namespace="auth")),
    path(
        "api/documents/",
        include(
            ("apps.documents.urls.documents_urls", "documents"), namespace="documents"
        ),
    ),
    path(
        "api/documents/versions/",
        include(
            ("apps.documents.urls.documents_versions_urls", "documents-versions"),
            namespace="documents-versions",
        ),
    ),
    # Swagger UI
    path(
        "api/docs/", schema_view.with_ui("swagger", cache_timeout=0), name="swagger-ui"
    ),
]


if settings.DEBUG:
    import debug_toolbar

    urlpatterns += [path("__debug__/", include(debug_toolbar.urls))]
