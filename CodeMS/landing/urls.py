from django.urls import path, re_path
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from . import views

urlpatterns = [
    path('info',views.info, name="info"),
    path('request',views.request, name="request"),
    path('kran',views.kranlanding, name='kran_landing'),
    path('kontakt',views.kontakt, name='kontakt'),
    path('danke',views.danke, name='danke'),
    path('send', views.send, name="send"),
]

    
