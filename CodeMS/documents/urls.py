from django.urls import path, re_path
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from . import views

urlpatterns = [
    path('datenschutz',views.datenschutz, name='datenschutz'),
    path('impressum/',views.impressum, name='impressum'), 
    path('referenzen',views.referenzen, name="referenzen"),
    path('tagesablauf/kran',views.tagesablauf_kran, name="tagesablauf_kran"),
]