"""CodeMS URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path, re_path
from django.conf.urls.static import static
from django.conf import settings

from django.conf.urls import include
from django.contrib.auth.models import User
from rest_framework import routers, serializers, viewsets

from landing_private.models import CourseDate, CourseRegistration
from landing.models import CourseRequest
from landingbuilder.models import page
from rest_framework import permissions
from django.contrib.auth.models import Group

def _is_in_group(user, group_name):
    """
    Takes a user and a group name, and returns `True` if the user is in that group.
    """
    try:
        return Group.objects.get(name=group_name).user_set.filter(id=user.id).exists()
    except Group.DoesNotExist:
        return None

def _has_group_permission(user, required_groups):
    return any([_is_in_group(user, group_name) for group_name in required_groups])

class IsAdminUser(permissions.BasePermission):
    # group_name for super admin
    def has_permission(self, request, view):
        if request.user.is_superuser:
            return True
        else:
            return False

class IsAdminOrAnonymousUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return True
        #has_group_permission = _has_group_permission(request.user, self.required_groups)
        #return request.user and has_group_permission

class CourseRequestSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = CourseRequest
        fields = ['course_type', 'customer_name', 'customer_email', 'customer_anschrift','customer_plz','customer_anzahl_teilnehmer',]
        optional_fields = ['customer_phone','customer_komentar', ]


class CourseDateSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = CourseDate
        fields = ['date', 'time', 'cost', 'status','location','location_post_id']

class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'username', 'email', 'is_staff']

class PageSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = page
        fields = ['id','slug', 'name', 'description', 'admin']

class CourseRegistrationSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = CourseRegistration
        fields = ['course_type', 'customer_name', 'customer_email', 'customer_anschrift','customer_plz','customer_anzahl_teilnehmer','customer_komentar']

# ViewSets define the view behavior.
class CourseRequestSet(viewsets.ModelViewSet):
    queryset = CourseRequest.objects.all()
    serializer_class = CourseRequestSerializer

    def get_permissions(self):
        permission_classes = []
        if self.action == 'create':
            permission_classes = [IsAdminOrAnonymousUser]
        elif self.action == 'list':
            permission_classes = [IsAdminUser]
        elif self.action == 'retrieve' or self.action == 'update' or self.action == 'partial_update':
            permission_classes = [IsAdminUser]
        elif self.action == 'destroy':
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        permission_classes = []
        if self.action == 'create':
            permission_classes = [IsAdminUser]
        elif self.action == 'list':
            permission_classes = [IsAdminUser]
        elif self.action == 'retrieve' or self.action == 'update' or self.action == 'partial_update':
            permission_classes = [IsAdminUser]
        elif self.action == 'destroy':
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]

class PageViewSet(viewsets.ModelViewSet):
    queryset = page.objects.all()
    serializer_class = PageSerializer

    def get_permissions(self):
        permission_classes = []
        if self.action == 'create':
            permission_classes = [IsAdminUser]
        elif self.action == 'list':
            permission_classes = [IsAdminUser]
        elif self.action == 'retrieve' or self.action == 'update' or self.action == 'partial_update':
            permission_classes = [IsAdminUser]
        elif self.action == 'destroy':
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]

class CourseDateViewSet(viewsets.ModelViewSet):
    queryset = CourseDate.objects.all()
    serializer_class = CourseDateSerializer

    def get_permissions(self):
        permission_classes = []
        if self.action == 'create':
            permission_classes = [IsAdminUser]
        elif self.action == 'list':
            permission_classes = [IsAdminOrAnonymousUser]
        elif self.action == 'retrieve' or self.action == 'update' or self.action == 'partial_update':
            permission_classes = [IsAdminUser]
        elif self.action == 'destroy':
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]

class CourseRegistrationViewSet(viewsets.ModelViewSet):
    queryset = CourseRegistration.objects.all()
    serializer_class = CourseRegistrationSerializer

    def get_permissions(self):
        permission_classes = []
        if self.action == 'create':
            permission_classes = [IsAdminOrAnonymousUser]
        elif self.action == 'list':
            permission_classes = [IsAdminUser]
        elif self.action == 'retrieve' or self.action == 'update' or self.action == 'partial_update':
            permission_classes = [IsAdminUser]
        elif self.action == 'destroy':
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]

# Routers provide an easy way of automatically determining the URL conf.
router = routers.DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'course_dates',CourseDateViewSet)
router.register(r'course_registrations',CourseRegistrationViewSet)
router.register(r'course_requests',CourseRequestSet)
router.register(r'pages',PageViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('',include('landing.urls')),
    path('',include('landing_private.urls')),
    path('',include('documents.urls')),
    path('dashboard/',include('dashboard.urls')),
    path('',include('exam.urls')),
    path('',include('django.contrib.auth.urls')),
    path('anymail/',include('anymail.urls')),
    path('front-edit/', include('front.urls')),
    path('api-auth/',include('rest_framework.urls',namespace='rest_framework')),
    path('api/', include(router.urls)),
    path('',include('landingbuilder.urls')),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
