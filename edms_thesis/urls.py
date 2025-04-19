from django.urls import path, include

from django.conf import settings

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
    api_info,
    public=True,
    permission_classes=(permissions.AllowAny, )
)

urlpatterns = [
       path(
        "api/",
        include([
            path('core/', include(('apps.core.urls', 'core'), namespace='core')),
            path('user/', include(('apps.user.urls', 'user'), namespace='user')),
            path('docs/', schema_view.with_ui('swagger', cache_timeout=0), name="swagger-schema"),
        ])
    ),
]


if settings.DEBUG:
    import debug_toolbar
    urlpatterns += [path('__debug__/', include(debug_toolbar.urls))]
