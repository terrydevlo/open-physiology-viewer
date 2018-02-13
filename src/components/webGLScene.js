import {NgModule, Component, ViewChild, ElementRef} from '@angular/core';
import {WebGLRenderService} from '../services/webGLRenderService';
import {TestDataService}   from '../services/testDataService';
import {KidneyDataService} from '../services/kidneyDataService';

import {CommonModule} from '@angular/common';
import {FormsModule}  from '@angular/forms';

@Component({
    selector: 'webGLScene',
    template: `
        <div class="view_selector">
            Show:
            <input type="checkbox" name="show_planes" (change)="_renderService.togglePlanes()"/> Grid
            <input type="checkbox" name="show_lyphs"  (change)="_renderService.toggleLyphs()" checked/> Lyphs
            <input type="checkbox" name="show_labels" (change)="_renderService.toggleLabels()" checked/> Labels
        </div>
        <div class="icon_selector">
            Lyph icon:
            <input type="radio" name="linkIcon_view" (change)="_renderService.toggleLinkIcon('2d')"/> 2D
            <input type="radio" name="linkIcon_view" (change)="_renderService.toggleLinkIcon('3d')" checked/> 3D
        </div>
        <div class="dimensions_selector">
            Dimensions:
            <input type="radio" name="num_dimensions" (change)="_renderService.toggleDimensions(2)"/> 2D
            <input type="radio" name="num_dimensions" (change)="_renderService.toggleDimensions(3)" checked/> 3D
        </div>
        <div id="webGLScene" #webGLScene></div>
    `,
    styles: [`
        #webGLScene { width: 100%; }
    `]
})
export class WebGLSceneComponent {
    @ViewChild('webGLScene') container: ElementRef;
    _testDataService: TestDataService;
    _kidneyDataService: KidneyDataService;

    constructor(renderService: WebGLRenderService) {
        this._renderService = renderService;
        this._testDataService = new TestDataService();
        this._kidneyDataService = new KidneyDataService();
        //this._testDataService.init();
        this._kidneyDataService.init();
    }

    ngAfterViewInit(){
       //Prepare data
       this._renderService.init(this.container.nativeElement, this._kidneyDataService.graphData);
    }
}

@NgModule({
    imports     : [CommonModule, FormsModule],
    declarations: [WebGLSceneComponent],
    providers   : [WebGLRenderService],
    exports     : [WebGLSceneComponent]
})
export class WebGLSceneModule {}
