from django.shortcuts import render
from .models import Question, Exam
from .forms import NewExam, NewQuestion
from django.http import HttpResponseRedirect

# Create your views here.

def exams(request):
    exams = Exam.objects.all()
    return render(request,'exam/exams.html',{'exams': exams})

def exam(request, id):
    questions = Question.objects.all()
    return render(request,'exam/exam.html',{'questions': questions})

def edit_exam(request, id):
    exam = Exam.objects.get(id=id)
    if request.method == 'POST':
        edit_form = NewExam(request.POST)
        if edit_form.is_valid():
            exam.exam_name = edit_form.cleaned_data['exam_name']
            exam.exam_description = edit_form.cleaned_data['exam_description']
            exam.save()
            return HttpResponseRedirect("/exam/%d/edit" % exam.id)
    else:
        edit_form = NewExam(initial={'exam_name':exam.exam_name,'exam_description':exam.exam_description})

    add_question_form = NewQuestion()

    return render(request,'exam/edit_exam.html',{'questions':exam.question_set.all(),'exam': exam,'exam_form':edit_form,'add_question_form':add_question_form})

def add_question(request, id):
    question_form = NewQuestion(request.POST)
    if question_form.is_valid():
        q = Question.objects.create()
        q.question_text = question_form.cleaned_data['question_text']
        q.answer1 = question_form.cleaned_data['answer1']
        q.answer2 = question_form.cleaned_data['answer2']
        q.answer3 = question_form.cleaned_data['answer3']
        q.correct_answer = question_form.cleaned_data['correct_answer']
        q.ex = Exam.objects.get(id=id)
        q.save()
        return HttpResponseRedirect("/exam/%d/edit" % id)

def delete_question(request, id):
    q = Question.objects.get(id=id)
    return_id = q.ex.id
    q.delete()
    return HttpResponseRedirect("/exam/%d/edit" % return_id)

def edit_question(request, id):
    q = Question.objects.get(id=id)
    exam_id = q.ex.id
    if request.method == 'POST':
        edit_form = NewQuestion(request.POST)
        if edit_form.is_valid():
            q.question_text = edit_form.cleaned_data['question_text']
            q.answer1 = edit_form.cleaned_data['answer1']
            q.answer2 = edit_form.cleaned_data['answer2']
            q.answer3 = edit_form.cleaned_data['answer3']
            q.correct_answer = edit_form.cleaned_data['correct_answer']
            q.save()
            return HttpResponseRedirect("/exam/%d/edit" % exam_id)
    else:
        edit_form = NewQuestion(initial={
            'question_text':q.question_text,
            'answer1':q.answer1,
            'answer2':q.answer2,
            'answer3':q.answer3,
            'correct_answer':q.correct_answer})

    add_question_form = NewQuestion()

    return render(request,'exam/edit_question.html',{
        'edit_question_form':edit_form,
        'q':q
        })

def delete_exam(request, id):
    Exam.objects.get(id=id).delete()
    return HttpResponseRedirect("/dashboard")

def new_exam(request):
    if request.method == 'POST':
        form = NewExam(request.POST)
        if form.is_valid():
            new_exam = Exam.objects.create()
            new_exam.exam_name = form.cleaned_data['exam_name']
            new_exam.exam_description = form.cleaned_data['exam_description']
            print(new_exam.exam_name)
            new_exam.save()
            return HttpResponseRedirect("/exam/%d/edit" % new_exam.id)
    else:
        form = NewExam()
    return render(request,"exam/add_exam.html",{'add_form': form})

def validateTest(request):
    testData = request.GET.get('test',None)
    answers = []
    questions = Question.objects.all()
    for q in questions:
        answers.append(q.correct_answer)

    data = {
        'answers': answers
    }
    return JsonResponse(data)