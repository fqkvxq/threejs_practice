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
let logoModel;

window.addEventListener('DOMContentLoaded', init);
function init() {
    //シーンの作成
    scene = new THREE.Scene();

    //カメラの作成
    camera = new THREE.PerspectiveCamera(0.5, window.innerWidth / window.innerHeight, 0.1, 1000);

    //カメラセット
    camera.position.set(0, 0, 20);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // 星屑を作成します (カメラの動きをわかりやすくするため)

    // スクロール/ピンチインなどで操作(OrbitControls)
    // const controls = new OrbitControls(camera, document.body);
    // controls.enableDamping = true;
    // controls.dampingFactor = 0.2;

    //光源
    const light = new THREE.SpotLight(0xffffff, 1); //color,強度
    light.position.set(100, 100, 100);
    scene.add(light);

    //レンダラー
    renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
    });

    // 背景色
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(window.innerWidth, window.innerHeight);

    loadGlbfile();
    //glbファイルの読み込み
    function loadGlbfile() {
        const loader = new GLTFLoader();
        loader.load('./untitled.glb', function (gltf) {
            logoModel = gltf.scene;
            logoModel.traverse((object) => { //モデルの構成要素
                if (object.isMesh) { //その構成要素がメッシュだったら
                    object.material.trasparent = true; //透明許可
                    object.material.opacity = 1; //透過
                    object.material.depthTest = true; //陰影で消える部分
                }
            })
            // add
            scene.add(logoModel);
        }, undefined, function (e) {
            console.error(e);
        });
        document.getElementById("WebGL-output").appendChild(renderer.domElement);
    }

    createThreeDObject();

    function createThreeDObject() {
        // 3Dオブジェクトを作る
        const x_size = window.innerWidth;
        const y_size = window.innerHeight;
        const length = 300;
        const plane_scale = 4;
        const plane = [];

        for (let i = 0; i < length; i++) {
            let geometry = new THREE.SphereGeometry(plane_scale, plane_scale, plane_scale);
            var material = new THREE.MeshBasicMaterial({
                color: '0xcccccc',
                opacity: 1,
                transparent: true
            });

            plane[i] = new THREE.Mesh(geometry, material);

            plane[i].position.x = x_size * (Math.random() - 0.5);
            plane[i].position.y = y_size * (Math.random() - 0.5);
            plane[i].position.z = x_size * (Math.random() - 0.5);
            scene.add(plane[i]);
        }
    }
}

function random(min, max) {
    let rand = Math.floor((min + (max - min + 1) * Math.random()));
    return rand;
}

tick();
function tick() {
    // このメソッドは、ブラウザーにアニメーションを行いたいことを知らせ、指定した関数を呼び出して次の再描画の前にアニメーションを更新することを要求します。このメソッドは、再描画の前に呼び出されるコールバック 1 個を引数として取ります。
    requestAnimationFrame(tick);

    // レンダリング処理
    renderer.render(scene, camera);


    logoModel.rotation.x += 0.005;
    logoModel.rotation.y += 0.005;
    logoModel.rotation.z += 0.005;
}