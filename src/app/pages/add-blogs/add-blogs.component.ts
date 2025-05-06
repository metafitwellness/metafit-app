import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { UsersService } from 'src/app/services/users.service';
import { ActivatedRoute, Router } from '@angular/router';

declare const tinymce: any;

@Component({
  selector: 'app-add-blogs',
  templateUrl: './add-blogs.component.html',
  styleUrls: ['./add-blogs.component.scss']
})
export class AddBlogsComponent  implements OnInit, AfterViewInit {

  seoForm: FormGroup;
  imageFile: File | null = null;
  isUpdate = false;
  updateId: number | null = null;
  image: any = '';
  imagePath: string = '';

  constructor(
    private fb: FormBuilder,
    public userService: UsersService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.seoForm = this.fb.group({
      name: ['', Validators.required],
      date: ['', Validators.required],
      des: ['', Validators.required],
      status: ['', Validators.required],
      footer_status: ['', Validators.required],
      url: ['', Validators.required],
      img: [null]
    });
  }

  ngAfterViewInit(): void {
    tinymce.init({
      selector: '#description',
      height: 300,
      setup: (editor: any) => {
        editor.on('Change KeyUp', () => {
          const content = editor.getContent();
          this.seoForm.get('des')?.setValue(content);
        });
      }
    });
  }

  ngOnDestroy(): void {
    tinymce.remove();
  }

  ngOnInit(): void {
    this.seoForm.get('name')?.valueChanges.subscribe(value => {
      const slug = this.generateSlug(value);
      this.seoForm.get('url')?.setValue(slug, { emitEvent: false });
    });

    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.userService.getBlogs(id).subscribe((res: any) => {
          if (res.status) {
            res.data.status = parseInt(res.data.status) === 1 ? 'active' : 'inactive';
            res.data.footer_status = parseInt(res.data.footer_status) === 1 ? 'yes' : 'no';
            this.isUpdate = true;
            this.updateId = res.data.id;
            this.seoForm.patchValue(res.data);

            this.imagePath = res.data.img;

            setTimeout(() => {
              const editor = tinymce.get('description');
              if (editor) {
                editor.setContent(res.data.des || '');
              }
            }, 1000);

          }
        });
      }
    });
  }


  private generateSlug(value: string): string {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')       // Remove special chars
      .replace(/\s+/g, '-')           // Replace spaces with hyphens
      .replace(/--+/g, '-');          // Replace multiple dashes
  }


  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imageFile = file;
    }
  }

  onSubmit() {
    if (this.seoForm.invalid) return;

    const formData = new FormData();
    for (const key in this.seoForm.value) {
      if (key !== 'img') {
        formData.append(key, this.seoForm.value[key]);
      }
    }

    if (this.imageFile) {
      formData.append('img', this.imageFile);
    }

    if (this.isUpdate) {
      this.userService.updateBlog(this.updateId, formData).subscribe((res: any) => {
        if (res.status) {
          this.router.navigate(['/blogs']);
        } else {
          alert('Error Adding SEO Pages');
        }
      });
    } else {
      this.userService.addBlog(formData).subscribe((res: any) => {
        if (res.status) {
          this.router.navigate(['/blogs']);
        } else {
          alert('Error Adding SEO Pages');
        }
      });
    }

  }

  // Call this with existing data if you're editing
  populateFormForEdit(data: any) {
    this.isUpdate = true;
    this.updateId = data.id;
    this.seoForm.patchValue({
      name: data.name,
      date: data.date,
      des: data.des,
      status: data.status,
      footer_status: data.footer_status,
      url: data.url
    });
  }
}
