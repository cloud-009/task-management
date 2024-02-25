import { NgModule } from "@angular/core";
import { NgHttpLoaderComponent, NgHttpLoaderModule } from "ng-http-loader";

@NgModule({
    declarations: [],
    imports: [NgHttpLoaderModule.forRoot()],
    exports: [NgHttpLoaderModule, NgHttpLoaderComponent]
})

export class LoaderModule { }