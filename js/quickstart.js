import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js';
import {
    OrbitControls
} from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js';
import {
    GLTFLoader
} from 'https://unpkg.com/three@0.126.1/examples/jsm/loaders/GLTFLoader.js';
let camera;
let scene;
let renderer;
let model;
init();
animate();

function init() {
    //シーンの作成
    scene = new THREE.Scene();
    //カメラの作成
    camera = new THREE.PerspectiveCamera(0.5, window.innerWidth / window.innerHeight, 0.1, 1000);
    // 星屑
    createStarField();
    //カメラセット
    camera.position.set(0, 0, 20);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // 星屑を作成します (カメラの動きをわかりやすくするため)

    // スクロール/ピンチインなどで操作(OrbitControls)
    // const controls = new OrbitControls(camera, document.body);
    // controls.enableDamping = true;
    // controls.dampingFactor = 0.2;

    //光源
    const dirLight = new THREE.SpotLight(0xffffff, 1.5); //color,強度
    dirLight.position.set(-20, 30, 30);
    scene.add(dirLight);
    //レンダラー
    renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
    });

    // 背景色
    renderer.setClearColor(new THREE.Color(0x000000));
    renderer.setSize(window.innerWidth, window.innerHeight);

    //glbファイルの読み込み
    const loader = new GLTFLoader();
    loader.load('./untitled.glb', function (gltf) {
        model = gltf.scene;
        model.traverse((object) => { //モデルの構成要素
            if (object.isMesh) { //その構成要素がメッシュだったら
                object.material.trasparent = true; //透明許可
                object.material.opacity = 1; //透過
                object.material.depthTest = true; //陰影で消える部分
            }
        })
        // add
        scene.add(model);
    }, undefined, function (e) {
        console.error(e);
    });
    document.getElementById("WebGL-output").appendChild(renderer.domElement);
}

function createStarField() {
    // 頂点情報を格納する配列
    const vertices = [];
    // 配置する範囲
    const SIZE = 3000;
    // 配置する個数
    const LENGTH = 1000;
    for (let i = 0; i < LENGTH; i++) {
        const x = SIZE * (Math.random() - 0.5);
        const y = SIZE * (Math.random() - 0.5);
        const z = SIZE * (Math.random() - 0.5);
        vertices.push(x, y, z);
    }
    // 形状データを作成
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    // マテリアルを作成
    const material = new THREE.PointsMaterial({
        // 一つ一つのサイズ
        size: 10,
        // 色
        color: 0xffffff,
    });
    // 物体を作成
    const mesh = new THREE.Points(geometry, material);
    scene.add(mesh);
}
animate();

function animate() {
    requestAnimationFrame(animate);
    model.rotation.x += 0.005;
    model.rotation.y += 0.005;
    model.rotation.z += 0.005;
    renderer.render(scene, camera);
}