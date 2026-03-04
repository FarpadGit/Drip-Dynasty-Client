import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location, registerLocaleData } from '@angular/common';
import localeHu from '@angular/common/locales/hu';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormArray,
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
import { SelectDirective } from '../../../../directives/UI/select.directive';
import { TextareaDirective } from '../../../../directives/UI/textarea.directive';
import { ImageFallbackDirective } from '../../../../directives/image-fallback.directive';
import { HeaderDirective } from '../../../../directives/UI/header.directive';
import { ButtonDirective } from '../../../../directives/UI/button.directive';
import { requiredFileType } from '../../../../utils/validators';
import { formatCurrency } from '../../../../utils/formatters';
import { NgxEditorModule, Editor, Toolbar } from 'ngx-editor';

type variantValuesType = FormArray<
  FormGroup<{
    name: FormControl<string | null>;
    stock: FormControl<number | null>;
  }>
>;

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
    SelectDirective,
    ButtonDirective,
    NumberInputComponent,
    TextareaDirective,
    ImageFallbackDirective,
    DeletableComponent,
    SwitchComponent,
  ],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss',
})
export class ProductFormComponent implements OnInit, OnDestroy {
  slug: string | null = null;
  requiredFileTypes = ['jpg', 'jpeg', 'png'];

  productForm = new FormGroup({
    productInfo: new FormGroup({
      name: new FormControl('', Validators.required),
      slug: new FormControl('', [
        Validators.required,
        Validators.pattern('[a-z][a-z0-9-]*'),
      ]),
      description: new FormControl('', Validators.required),
      categories: new FormArray([] as FormControl[]),
      price: new FormControl<number>(1, [
        Validators.required,
        Validators.min(1),
        Validators.pattern('[0-9 ]*'),
      ]),
      emailMessage: new FormControl(''),
      defaultStock: new FormControl(0),
      variants: new FormArray<
        FormGroup<{
          groupName: FormControl<string | null>;
          type: FormControl<
            NonNullable<productType['variants']>[number]['type'] | null
          >;
          variants: variantValuesType;
        }>
      >([]),
      searchTags: new FormArray<
        FormGroup<{
          name: FormControl<string | null>;
          value: FormControl<string | null>;
        }>
      >([]),
    }),
    discount: new FormGroup({
      on: new FormControl<boolean>(false),
      discountValue: new FormControl<number>(1, [
        Validators.min(1),
        Validators.pattern('[0-9 ]*'),
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

  routeParamSub: Subscription | null = null;
  product: productType | null = null;

  constructor(
    private productService: ProductService,
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    registerLocaleData(localeHu, 'hu');
  }

  async ngOnInit() {
    this.editor = new Editor();
    this.routeParamSub = this.route.paramMap.subscribe(
      (params) => (this.slug = params.get('slug')),
    );

    if (this.slug !== null) {
      this.product = await this.productService.getProductBySlug(this.slug);

      if (!this.product) {
        this.location.back();
      } else {
        const productFields = this.productForm.controls.productInfo.controls;
        const discountFields = this.productForm.controls.discount.controls;
        productFields.name.setValue(this.product.name);
        productFields.slug.setValue(this.product.slug);
        productFields.description.setValue(this.product.description);
        productFields.categories.clear();
        if (this.product.categories?.length === 0)
          productFields.categories.push(new FormControl(''));
        else
          this.product.categories?.forEach((cat) => {
            productFields.categories.push(new FormControl(cat));
          });
        productFields.price.setValue(this.product.price);
        productFields.emailMessage.setValue(this.product.emailMessage ?? null);
        productFields.defaultStock.setValue(this.product.defaultStock ?? 0);

        productFields.variants.clear();
        this.product.variants?.forEach((variantGroup) => {
          const formGroupsForValues = variantGroup.variants.map((value) => {
            return new FormGroup<{
              name: FormControl<string | null>;
              stock: FormControl<number | null>;
            }>({
              name: new FormControl<string | null>(value.name),
              stock: new FormControl<number | null>(value.stock),
            });
          });

          productFields.variants.push(
            new FormGroup({
              groupName: new FormControl(variantGroup.groupName),
              type: new FormControl(variantGroup.type),
              variants: new FormArray<(typeof formGroupsForValues)[number]>(
                formGroupsForValues,
              ),
            }),
          );
        });

        productFields.searchTags.clear();
        this.product.searchTags?.forEach((tag) => {
          productFields.searchTags.push(
            new FormGroup({
              name: new FormControl(tag.name),
              value: new FormControl(tag.value),
            }),
          );
        });

        discountFields.on.setValue(this.product.discount > 0);
        discountFields.discountValue.setValue(this.product.discount);
        discountFields.discountPercent.setValue(this.discountPercentage);

        this.images = this.product.imagePaths.map((path) => ({
          id: crypto.randomUUID(),
          name: path,
          image: { src: path },
          shouldDelete: false,
          existsOnServer: true,
        }));
      }
    }
  }

  ngOnDestroy(): void {
    this.routeParamSub?.unsubscribe();
    this.editor.destroy();
  }

  get form() {
    return this.productForm.controls;
  }
  get productInfo() {
    return this.productForm.controls.productInfo.controls;
  }
  get categories() {
    return this.productForm.controls.productInfo.controls.categories.controls;
  }
  get variants() {
    return this.productForm.controls.productInfo.controls.variants.controls;
  }
  get searchTags() {
    return this.productForm.controls.productInfo.controls.searchTags.controls;
  }
  get discount() {
    return this.productForm.controls.discount.controls;
  }
  get discountPercentage() {
    const price = Number(
      this.productForm.controls.productInfo.controls.price.value!,
    );
    const discount = Number(
      this.productForm.controls.discount.controls.discountValue.value!,
    );
    return +((discount / price) * 100).toFixed(2);
  }
  get discountedPrice() {
    return formatCurrency(
      Number(this.productForm.controls.productInfo.controls.price.value) -
        Number(this.productForm.controls.discount.controls.discountValue.value),
    );
  }
  get placeholderText() {
    return this.slug !== null && this.product == null
      ? 'loading details...'
      : '';
  }

  get submitDisabled() {
    return (
      this.productForm.controls.productInfo.invalid ||
      this.imagePaths.length === 0
    );
  }

  addNewCategory() {
    this.productInfo.categories.push(new FormControl(''));
  }
  removeCategory(index: number) {
    this.productInfo.categories.removeAt(index);
  }

  addNewVariant() {
    const form = new FormGroup({
      groupName: new FormControl(''),
      type: new FormControl('text'),
      variants: new FormArray([
        new FormGroup({
          name: new FormControl(''),
          stock: new FormControl(0),
        }),
      ]),
    }) as (typeof this.productInfo.variants.controls)[number];
    this.productInfo.variants.push(form);
  }
  removeVariant(index: number) {
    this.productInfo.variants.removeAt(index);
  }
  addToVariant(variants: variantValuesType) {
    variants.push(
      new FormGroup({
        name: new FormControl(''),
        stock: new FormControl(0),
      }),
    );
  }
  removeFromVariant(variants: variantValuesType, index: number) {
    variants.removeAt(index);
  }

  addNewSearchTag() {
    const form = new FormGroup({
      name: new FormControl(''),
      value: new FormControl(''),
    }) as (typeof this.productInfo.searchTags.controls)[number];
    this.productInfo.searchTags.push(form);
  }
  removeSearchTag(index: number) {
    this.productInfo.searchTags.removeAt(index);
  }

  onStockChange(e: Event) {
    const value = (e.target as HTMLInputElement).value;
    if (value.startsWith('0') && value !== '0')
      (e.target as HTMLInputElement).value = value.slice(1);
  }

  onDiscountPercentChange(e: Event) {
    let percent = +(e.target as HTMLInputElement).value;
    if (percent > 100) percent = 100;
    if (percent < 1) percent = 1;
    const price = Number(
      this.productForm.controls.productInfo.controls.price.value!,
    );
    const discount = Math.round((price * percent) / 100);
    this.productForm.controls.discount.controls.discountValue.setValue(
      discount,
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
    // ngx-editor didn't set its buttons to type='button' so now some of them will try to submit the form
    // and I have to check whether the submit button called this function or not...
    if (!this.validSubmit) return;

    const productFieldValues = this.productForm.value.productInfo!;
    const discount = this.productForm.value.discount;

    const newProduct = {
      name: productFieldValues.name,
      slug: productFieldValues.slug,
      description: productFieldValues.description,
      categories: productFieldValues.categories,
      price: productFieldValues.price,
      discount: discount?.on ? discount.discountValue : 0n,
      emailMessage: productFieldValues.emailMessage,
      variants: productFieldValues.variants,
      searchTags: productFieldValues.searchTags,
      defaultStock:
        (productFieldValues.variants?.length || 0) > 0
          ? undefined
          : productFieldValues.defaultStock,
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

    if (this.slug !== null) {
      const newImages = newImageFiles.map((img, i) => {
        return { file: img, path: newProduct.imagePaths[i] };
      });
      this.productService.updateProduct(
        this.product!.id,
        newProduct,
        newImages,
        imagesToDelete,
      );
    } else {
      this.productService.addNewProduct(newProduct, newImageFiles);
    }

    this.productForm.reset({
      productInfo: { price: 1, defaultStock: 0 },
      discount: { on: false, discountValue: 0 },
    });
    this.images = [];

    this.router.navigate(['/admin/products']);
  }

  onCancel() {
    this.location.back();
  }
}
