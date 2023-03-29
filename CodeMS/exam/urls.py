from django.urls import path, re_path
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from . import views

urlpatterns = [
    path('exam/<int:id>',views.exam, name='exam'),
    path('exam/<int:id>/edit',views.edit_exam, name='edit_exam'),
    path('exam/<int:id>/delete', views.delete_exam, name="delete_exam"),
    path('exam/<int:id>/add_question',views.add_question, name='add_question'),
    path('question/<int:id>/delete',views.delete_question, name="delete_question"),
    path('question/<int:id>/edit',views.edit_question, name="edit_question"),
    path('exam/',views.exams, name="exams"),
    path('new_exam/',views.new_exam, name="new_exam"),
    re_path(r'^ajax/validateTest/$',views.validateTest, name="validateTest"),
]

    
