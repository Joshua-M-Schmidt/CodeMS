from django.urls import path,re_path
from .views import *

urlpatterns = [
    path('pages/',page_admin),
    path('blocks/',blocks_admin),
    path('get_blocks/',get_blocks),
    path('block_edit/<int:id>/',edit_block),
    path('save_block/<int:id>/',save_block),
    path('get_block/<int:id>/',get_block),
    path('delete_page/<int:id>/',delete_page),
    path('delete_block/<int:id>/',delete_block),
    path('page_stats/<int:id>/',page_stats),
    path('get_page_stats/<int:id>/',get_page_stats),
    path('save_page/<int:id>/', save_page),
    path('get_page/<int:id>/<int:version>/', get_page),
    path('<slug:slug>/', base),
    path('', home),
    re_path(r'^(?P<slug>\w+)/(.*?)/$', base),
]
