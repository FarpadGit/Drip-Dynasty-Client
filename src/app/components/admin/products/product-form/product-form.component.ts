import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location, registerLocaleData } from '@angular/common';
import localeHu from '@angular/common/locales/hu';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { ProductService } from '../../../../services/product.service';
import {
  FileUploadComponent,
  fileUploadType,
} from '../../../UI/file-upload/file-upload.component';
import { NumberInputComponent } from '../../../UI/number-input/number-input.component';
import { SwitchComponent } from '../../../UI/switch/switch.component';
import { DeletableComponent } from '../../../UI/deletable/deletable.component';
import { LabelDirective } from '../../../../directives/UI/label.directive';
import { InputDirective } from '../../../../directives/UI/input.directive';
import { TextareaDirective } from '../../../../directives/UI/textarea.directive';
import { ImageFallbackDirective } from '../../../../directives/image-fallback.directive';
import { HeaderDirective } from '../../../../directives/UI/header.directive';
import { ButtonDirective } from '../../../../directives/UI/button.directive';
import { requiredFileType } from '../../../../utils/validators';
import { formatCurrency } from '../../../../utils/formatters';
import { productType } from '../../../../types';
import { NgxEditorModule, Editor, Toolbar } from 'ngx-editor';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgxEditorModule,
    FileUploadComponent,
    HeaderDirective,
    LabelDirective,
    InputDirective,
    ButtonDirective,
    NumberInputComponent,
    TextareaDirective,
    ImageFallbackDirective,
    DeletableComponent,
    SwitchComponent,
  ],
  templateUrl: './product-form.component.html',
})
export class ProductFormComponent implements OnInit, OnDestroy {
  requiredFileTypes = ['jpg', 'jpeg', 'png'];

  productForm = new FormGroup({
    productInfo: new FormGroup({
      name: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      categories: new FormControl(''),
      price: new FormControl<number>(1, [
        Validators.required,
        Validators.min(1),
        Validators.pattern('[0-9| ]*'),
      ]),
      extra: new FormControl(''),
    }),
    discount: new FormGroup({
      on: new FormControl<boolean>(false),
      discountValue: new FormControl<number>(1, [
        Validators.min(1),
        Validators.pattern('[0-9| ]*'),
      ]),
      discountPercent: new FormControl<number>(1, [
        Validators.min(1),
        Validators.max(100),
      ]),
    }),
    images: new FormControl<FileList | null>(null, [
      requiredFileType(this.requiredFileTypes),
    ]),
  });
  validSubmit: boolean = false;

  editor!: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link'],
    // ['align_left', 'align_center', 'align_right', 'align_justify'],
    ['horizontal_rule', 'format_clear'],
    ['superscript', 'subscript'],
    ['undo', 'redo'],
  ];

  images: fileUploadType[] = [];

  get imagePaths() {
    return this.images.map((img) => this.getFileName(img.name));
  }

  get imagePreviews() {
    return this.images.map((img) => img.image.src);
  }

  get imagePreviewRows() {
    return Math.floor((this.images.length - 1) / 3) + 1;
  }

  userId: string | null = null;
  routeParamSub: Subscription | null = null;
  valueChangeSub: Subscription | null = null;
  product: productType | null = null;

  constructor(
    private productService: ProductService,
    private location: Location,
    private route: ActivatedRoute,
    private router: Router
  ) {
    registerLocaleData(localeHu, 'hu');
  }

  async ngOnInit() {
    this.editor = new Editor();
    this.routeParamSub = this.route.paramMap.subscribe(
      (params) => (this.userId = params.get('id'))
    );

    if (this.userId !== null) {
      this.product = await this.productService.getProduct(this.userId);

      if (!this.product) {
        this.location.back();
      } else {
        const productFields = this.productForm.controls.productInfo.controls;
        const discountFields = this.productForm.controls.discount.controls;
        productFields.name.setValue(this.product.name);
        productFields.description.setValue(this.product.description);
        productFields.categories.setValue(
          this.product.categories?.join(', ') ?? null
        );
        productFields.price.setValue(this.product.price);
        productFields.extra.setValue(this.product.extra ?? null);

        discountFields.on.setValue(this.product.discount > 0);
        discountFields.discountValue.setValue(this.product.discount);
        discountFields.discountPercent.setValue(this.discountPercentage);

        this.images = this.product.imagePaths.map((path) => {
          return {
            id: crypto.randomUUID(),
            name: path,
            image: { src: path },
            shouldDelete: false,
            existsOnServer: true,
          };
        });
      }
    }
  }

  ngOnDestroy(): void {
    this.routeParamSub?.unsubscribe();
    this.valueChangeSub?.unsubscribe();
    this.editor.destroy();
  }

  get form(): any {
    return this.productForm.controls;
  }
  get productInfo(): any {
    return this.productForm.controls.productInfo.controls;
  }
  get discount(): any {
    return this.productForm.controls.discount.controls;
  }
  get discountPercentage() {
    const price = Number(
      this.productForm.controls.productInfo.controls.price.value!
    );
    const discount = Number(
      this.productForm.controls.discount.controls.discountValue.value!
    );
    return +((discount / price) * 100).toFixed(2);
  }
  get discountedPrice() {
    return formatCurrency(
      Number(this.productForm.controls.productInfo.controls.price.value) -
        Number(this.productForm.controls.discount.controls.discountValue.value)
    );
  }

  onDiscountPercentChange(e: Event) {
    let percent = +(e.target as HTMLInputElement).value;
    if (percent > 100) percent = 100;
    if (percent < 1) percent = 1;
    const price = Number(
      this.productForm.controls.productInfo.controls.price.value!
    );
    const discount = Math.round((price * percent) / 100);
    this.productForm.controls.discount.controls.discountValue.setValue(
      discount
    );
  }

  getFileName(filePath: string) {
    const filePathSegments = filePath.split('/');
    if (filePathSegments.length === 0) return filePath;
    return filePathSegments[filePathSegments.length - 1];
  }

  handleFilesChanged(uploadedImages: fileUploadType[]) {
    uploadedImages.forEach((img) => this.images.push(img));
  }

  handleImageDelete(index: number, state: boolean) {
    this.images[index].shouldDelete = state;
  }

  async addOrUpdateProduct() {
    // ngx-editor didn't set its buttons to type='button' so now some of them will try to submit the form...
    // has to check whether the submit button called this function or not...
    if (!this.validSubmit) return;

    const productFieldValues = this.productForm.value.productInfo!;
    const discount = this.productForm.value.discount;

    const newProduct = {
      name: productFieldValues.name,
      description: productFieldValues.description,
      categories: productFieldValues.categories
        ?.replace(/,\s*/g, ',')
        .split(','),
      price: productFieldValues.price,
      discount: discount?.on ? discount.discountValue : 0n,
      extra: productFieldValues.extra,
      imagePaths: [],
    } as Omit<productType, 'id' | 'isActive' | 'createdSince'>;

    let newImageFiles: File[] = [];
    let imagesToDelete: string[] = [];

    if (this.images.length === 0) return;

    newImageFiles = this.images
      .filter((img) => !img.existsOnServer && !img.shouldDelete)
      .map((img) => img.image?.file)
      .filter((img) => img != undefined) as File[];

    const newImagePaths = this.images
      .filter((img) => !img.existsOnServer && !img.shouldDelete)
      .map((img) => img.name);
    newProduct.imagePaths = newImagePaths;

    imagesToDelete = this.images
      .filter((img) => img.existsOnServer && img.shouldDelete)
      .map((img) => img.name);

    if (this.userId !== null) {
      const newImages = newImageFiles.map((img, i) => {
        return { file: img, path: newProduct.imagePaths[i] };
      });
      this.productService.updateProduct(
        this.userId,
        newProduct,
        newImages,
        imagesToDelete
      );
    } else {
      this.productService.addNewProduct(newProduct, newImageFiles);
    }

    this.productForm.reset({
      productInfo: { price: 1 },
      discount: { on: false, discountValue: 0 },
    });
    this.images = [];

    this.router.navigate(['/admin/products']);
  }

  onCancel() {
    this.location.back();
  }
}
