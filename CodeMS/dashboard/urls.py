from django.urls import path, re_path
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from . import views

urlpatterns = [
    path('',views.dashboard, name="dashboard"),
]

    