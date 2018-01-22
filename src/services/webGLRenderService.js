import * as THREE from 'three';
import * as TWEEN from 'es6-tween'
import TrackballControls from 'three-trackballcontrols';
import ThreeForceGraph from '../three/ThreeForceGraph';
import {dataSetMain}   from '../data/graph';

export class WebGLRenderService {
    scene    : THREE.Scene;
    camera   : THREE.PerspectiveCamera;
    renderer : THREE.WebGLRenderer;
    controls : TrackballControls;
    raycaster: THREE.Raycaster;
    graph;
    planes = [];

    init(container: HTMLElement) {
        if (this.renderer) {return;} //already initialized

        const width = window.innerWidth;
        const height = window.innerHeight - 90;

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, width / height);
        this.camera.position.set(0, 100, 100);
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.renderer = new THREE.WebGLRenderer({antialias: true});

        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(width, height);
        this.renderer.setClearColor(0x000000);
        container.appendChild(this.renderer.domElement);

        this.controls = new TrackballControls(this.camera, container);

        // Lights
        const ambientLight = new THREE.AmbientLight(0xcccccc);
        this.scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xffffff);
        pointLight.position.set(300, 0, 300);
        this.scene.add(pointLight);

        this.raycaster = new THREE.Raycaster();

        this.createPlanes();
        this.createGraph();
        this.animate();
    }


    animate() {
        if (this.graph){
            this.graph.tickFrame();
        }
        this.controls.update();
        TWEEN.update();
        this.renderer.render(this.scene, this.camera);
        window.requestAnimationFrame(_ => this.animate());
    }

    createPlanes() {
        let gridColor = new THREE.Color(0x333333);
        let axisColor = new THREE.Color(0x666666);

        // x-y plane
        let gridHelper1 = new THREE.GridHelper(1000, 10, axisColor, gridColor);
        gridHelper1.geometry.rotateX( Math.PI / 2 );
        this.scene.add(gridHelper1);
        this.planes.push(gridHelper1);

        // x-z plane
        let gridHelper2 = new THREE.GridHelper(1000, 10, axisColor, gridColor);
        this.scene.add(gridHelper2);
        this.planes.push(gridHelper2);

        let axisHelper = new THREE.AxisHelper( 510 );
        this.scene.add( axisHelper );
    }

    createGraph() {

        dataSetMain.links.forEach(link => link.color = "#66ccff");
        //Create
        this.graph = new ThreeForceGraph()
            //.nodeRelSize(0.9)
            .nodeAutoColorBy('color')
            .graphData(dataSetMain);

        this.scene.add(this.graph);
    }

    togglePlanes(){
        this.planes.forEach(plane => {plane.visible = !plane.visible});
    }

    toggleGraph(label){
        //Toggle graph category visibility
        //this.graphs[label].visible = !this.graphs[label].visible;

    }

    toggleDimensions(numDimensions) {
        this.graph.numDimensions(numDimensions);
    };
}