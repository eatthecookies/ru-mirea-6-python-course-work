from django.urls import path, include
from rest_framework.routers import DefaultRouter
from blog.views import BlogViewSet, PostViewSet, CommentViewSet, UserViewSet  # Импортируй свои viewset
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions

# Создание маршрутизатора и регистрация viewset
router = DefaultRouter()
router.register(r'blogs', BlogViewSet)
router.register(r'posts', PostViewSet)
router.register(r'comments', CommentViewSet)
router.register(r'users', UserViewSet)

# Настройка Swagger
schema_view = get_schema_view(
    openapi.Info(
        title="Blog API",
        default_version='v1',
        description="Документация платформы блогов",
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

# Настройка URL-ов
urlpatterns = [
    path('', include(router.urls)),  # API маршруты
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),  # Swagger UI
]
