import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage';
import {finalize} from "rxjs/operators";

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css']
})
export class ImageComponent implements OnInit {

  imageSrc : String; 
  selectedImage: any ;
  isSubmitted:Boolean;

  formTemplate = new FormGroup({
    caption : new FormControl('',Validators.required),
    category : new FormControl(''),
    imageUrl : new FormControl('',Validators.required)
  })

  constructor(private storage:AngularFireStorage) { }

  ngOnInit() {
    this.resetForm();
  }

  showPreview(event:any){
    if(event.target.files && event.target.files[0]){
      const reader = new FileReader();
      reader.onload = (e:any)=>this.imageSrc = e.target.result;
      reader.readAsDataURL(event.target.files[0]);
      this.selectedImage = event.target.files[0];
    }
    else{
      this.imageSrc = '/assets/img/upload.jpeg';
      this.selectedImage = null;
      
    }
  }
  onSubmit(FormValue){
    this.isSubmitted=true;
    if(this.formTemplate.valid){
      var filePath = `${FormValue.category}/${this.selectedImage.name}_${new Date().getTime()}`;
      const fileRef = this.storage.ref(filePath)
      this.storage.upload(filePath,this.selectedImage).snapshotChanges().pipe(
        finalize(()=>{
          fileRef.getDownloadURL().subscribe((url)=>{

            FormValue['imageUrl']=url;
            this.resetForm();

          })
        })
      
      ).subscribe();
    }

  }
  get formControls(){
    return this.formTemplate['controls'];
  }
  resetForm(){
    this.formTemplate.reset();
    this.formTemplate.setValue({
      caption:'',
      imageUrl:'',
      category:'Animal'

    });
    this.imageSrc='/assets/img/upload.jpeg';
    this.isSubmitted = false;
    this.selectedImage = null;
  }

}
