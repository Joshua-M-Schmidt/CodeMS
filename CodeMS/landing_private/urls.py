from django.urls import path, re_path
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from . import views

urlpatterns = [
    path('kranPrivat',views.landingpagePrivate, name='kran_landing_privat'),
    path('anmelden/<int:id>',views.anmelden, name="anmelden"),
    path('dankeprivat',views.dankePrivat, name="dankePrivat"),
]

    
