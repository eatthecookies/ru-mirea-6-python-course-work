from rest_framework import viewsets, permissions
from .models import Blog, Post, Comment
from .serializers import BlogSerializer, PostSerializer, CommentSerializer, UserSerializer
from django.contrib.auth.models import User
from rest_framework.decorators import action
from rest_framework.response import Response

# Вьюсеты для работы с блогами
class BlogViewSet(viewsets.ModelViewSet):
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer


# Вьюсеты для работы с постами
class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

# Вьюсеты для работы с комментариями
class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

# Вьюсеты для работы с пользователями
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]  # Разрешаем доступ всем для создания пользователей

    @action(detail=False, methods=['get'])
    def id(self, request):
        user = request.user
        return Response({'user_id': user.id})
