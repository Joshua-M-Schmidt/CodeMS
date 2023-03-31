from django.shortcuts import render
from django.http import Http404
from .models import page, page_version, Hit, Identifier, Id_Category, Block, BlockCategory
from landing.models import CourseRequest
from django.shortcuts import redirect
from django.contrib.auth.decorators import user_passes_test
import codeMS.auth as auth
from django.core.exceptions import ObjectDoesNotExist
from django.http import JsonResponse
import json
from datetime import timedelta, date, datetime
import pytz  
tz = pytz.timezone('Europe/Berlin')

@user_passes_test(auth.is_superuser, login_url='/')
def save_page(request, id):
    data = json.loads(request.body)
    html = str(data['html'])
    new = data['new']

    p = page.objects.get(id=id)

    if new:
        page_v = page_version.objects.create(
        page_link = p,
        revision = p.revision,
        category = p.category,
        slug = p.slug+str(p.revision),
        name = p.name,
        description = p.description,
        content = p.content)
        page_v.save() 
        p.revision = p.revision + 1
        p.sub_revision = 0
    else:
        p.sub_revision = p.sub_revision + 1

    p.content = html
    p.save()

    return JsonResponse({'version': p.revision, 'subversion': p.sub_revision})

@user_passes_test(auth.is_superuser, login_url='/')
def get_page(request, id, version):
    p = page.objects.get(id=id)
    if not version == p.revision and version != 0:
        v_slug = str(p.slug)+""+str(version)
        p = page_version.objects.get(slug=v_slug)
        return JsonResponse({'html':p.content, 'version': p.revision,'subversion':0,})
    return JsonResponse({'html':p.content, 'version': p.revision,'subversion': p.sub_revision,})


@user_passes_test(auth.is_superuser, login_url='/')
def save_block(request, id):
    data = json.loads(request.body)
    html = str(data['html'])
    b = Block.objects.get(id=id)
    b.content = html
    b.save()

    return JsonResponse({'success': True})

@user_passes_test(auth.is_superuser, login_url='/')
def get_block(request, id):
    b = Block.objects.get(id=id)
    return JsonResponse({'html':b.content})

@user_passes_test(auth.is_superuser, login_url='/')
def page_admin(request):
    pages = page.objects.all()
    for p in pages:
        print(p.revision)
    return render(request, 'landingbuilder/pages_admin.html', {'pages':pages})

@user_passes_test(auth.is_superuser, login_url='/')
def blocks_admin(request):
    blocks = Block.objects.all()
    return render(request, 'landingbuilder/blocks.html', {'blocks':blocks})

@user_passes_test(auth.is_superuser, login_url='/')
def edit_block(request,id):
    block = Block.objects.get(id=id)
    return render(request, 'landingbuilder/block_editor.html', {'block':block})

@user_passes_test(auth.is_superuser, login_url='/')
def delete_page(request, id):
    p = page.objects.get(id=id)
    p.delete()
    return redirect('/pages/')

@user_passes_test(auth.is_superuser, login_url='/')
def delete_block(request, id):
    p = Block.objects.get(id=id)
    p.delete()
    return redirect('/blocks/')

@user_passes_test(auth.is_superuser, login_url='/')
def page_stats(request, id):
    p = page.objects.get(id=id)
    return render(request, 'landingbuilder/page_stats.html', {'p':p})

@user_passes_test(auth.is_superuser, login_url='/')
def get_page_stats(request, id):
    p = page.objects.get(id=id)
    response_obj = {
        'page_req': get_page_data(id,p),
    }

    return JsonResponse(response_obj, safe=False)

def get_page_data(id,p):
    
    reqs = CourseRequest.objects.filter(page_link=p,created_at__range=[(datetime.now() - timedelta(days=91)),(datetime.now() + timedelta(days=1))]).order_by('created_at')
    hits = Hit.objects.filter(page_hit=p,created_at__range=[(datetime.now() - timedelta(days=91)),(datetime.now() + timedelta(days=1))]).order_by('created_at')
    
    pages_old = page_version.objects.filter(page_link=p,created_at__range=[(datetime.now() - timedelta(days=91)),(datetime.now() + timedelta(days=1))]).order_by('created_at')

    labels = []
    req_data = []
    hit_data = []
    line_data = []

    req_data_dic = {}
    hit_data_dic = {}

    end_date = tz.localize(datetime.now() + timedelta(days=2), is_dst=None).astimezone(pytz.utc)   
    start_date = p.created_at

    for single_date in daterange(start_date, end_date):
        #print(single_date.strftime("%Y-%m-%d"))
        req_data_dic[single_date.strftime("%Y-%m-%d")] = 0
        hit_data_dic[single_date.strftime("%Y-%m-%d")] = 0

    for req in reqs:
        req_data_dic[req.created_at.strftime("%Y-%m-%d")] =  req_data_dic[req.created_at.strftime("%Y-%m-%d")] + 1

    for key in req_data_dic:
        labels.append(key)
        req_data.append(req_data_dic[key])

    for hit in hits:
        hit_data_dic[hit.created_at.strftime("%Y-%m-%d")] =  hit_data_dic[hit.created_at.strftime("%Y-%m-%d")] + 1

    for key in hit_data_dic:
        labels.append(key)
        hit_data.append(hit_data_dic[key])

    version_object_list = []

    current_start_date = start_date 
    current_end_date = pages_old[0].created_at
    current_slug = 'created'

    for i in range(len(pages_old)+1):
        print(str(i) + " "+ current_slug)

        if i > 0:
            current_slug = pages_old[i-1].slug
        
        #print(pages_old[i].created_at.strftime("%Y-%m-%d"))
        hits_dic_pv = 0
        req_dic_pv = 0
        for key in hit_data_dic:
            key_date = tz.localize(datetime.strptime(key, "%Y-%m-%d"), is_dst=None).astimezone(pytz.utc)  
            if key_date >= current_start_date and key_date < current_end_date:
                hits_dic_pv = hits_dic_pv + hit_data_dic[key_date.strftime("%Y-%m-%d")]

        for key in req_data_dic:
            key_date = tz.localize(datetime.strptime(key, "%Y-%m-%d"), is_dst=None).astimezone(pytz.utc)
            if key_date >= current_start_date and key_date < current_end_date:
                req_dic_pv = req_dic_pv + req_data_dic[key_date.strftime("%Y-%m-%d")]
    

        conv_rate = 0
        if hits_dic_pv > 0:
            conv_rate = req_dic_pv/hits_dic_pv*100.0

        pv_obj = {
            'start': current_start_date.strftime("%Y-%m-%d"),
            'end': current_end_date.strftime("%Y-%m-%d"),
            'slug': current_slug,
            'hits': hits_dic_pv,
            'req': req_dic_pv,
            'conv_rate': conv_rate
        }

        version_object_list.append(pv_obj)

        

        if i < len(pages_old)-1:
            current_start_date = pages_old[i].created_at
            current_end_date = pages_old[i+1].created_at
        else:
            current_start_date = pages_old[len(pages_old)-1].created_at
            current_end_date = end_date 
    	
    i = 0

    line_data.append(0)

    for key in hit_data_dic:
        #print(key)
        for page in pages_old:
            if page.created_at.strftime("%Y-%m-%d") == key:
                line_data.append(i)
        i = i + 1
    
    return { 'req_data': req_data,'hit_data': hit_data, 'labels': labels, 'line_data': line_data, 'versions': version_object_list}

def daterange(start_date, end_date):
    for n in range(int((end_date - start_date).days)):
        yield start_date + timedelta(n)

def base(request, slug):
    try:
        p = page.objects.get(slug=slug)
        if not p.admin: # admin has to interpreted as public
            if request.user.is_superuser:
                return returnPage(request, slug, p)
            else:
                return redirect('/login')

        if not request.user.is_superuser:
            url_param = request.GET.get('source','')
            print(url_param)
            p.hits = p.hits + 1
            p.save()
            Hit.objects.create(
                source_identifier = url_param,
                page_hit = p,
                page_version = p.revision
            )
        return returnPage(request, slug, p)
    except ObjectDoesNotExist:
        if slug == 'home':
            return redirect('/login')
        raise Http404("Page does not exist")

def home(request):
    if request.user.is_superuser:
        return redirect('/pages')
    return base(request,'home')

def returnPage(request, slug, p):
    if request.user.is_superuser:
        return render(request, 'landingbuilder/base.html', {'p':p,'blocks': Block.objects.all()})
    else:
        return render(request, 'landingbuilder/base.html', {'p':p})

@user_passes_test(auth.is_superuser, login_url='/')
def get_blocks(request):
    blocks = Block.objects.all()
    blks = []

    for block in blocks:
        blk = {}
        blk['identifier'] = block.identifier
        blk['label'] = block.label
        blk['category'] = block.category.title
        blk['content'] = block.content
        blk['fa_icon'] = block.fa_icon
        blks.append(blk)

    print(blks)

    return JsonResponse({'blocks':blks})