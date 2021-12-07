import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry';
import { Line2 } from 'three/examples/jsm/lines/Line2';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module';

import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js'

import imgUrl from '/src/assets/embrace.mp3'
document.getElementById('song').src = imgUrl

import modelVinyl from '/src/assets/Vinyl_disc.glb'
import modelPlayer from '/src/assets/player(1).glb'
import modelCassette from '/src/assets/cassette.glb'
import modelVinyl2 from '/src/assets/vinyl2.glb'
import modelTable from '/src/assets/table.glb'
import modelTV from '/src/assets/tv.glb'
import modelRecorder from '/src/assets/recorder.glb'

let len;
let density;
let f = 0;
let v = 0;
let music;
let radius = 0.4;
let dot_radius = 0.25;
let startedAt;
let pausedAt;
let paused = false;
let buff;
let data;
let micOn = false;
let localMusic = false;
let localCtx;
let iptMusic = false;
let audioBind = false;
let bind;
let fr, arrayBuffer, audioCtx, source, analyser, ipt;
const micButton = document.getElementById("mic");
const button = document.getElementById("PlayButton");
const panel = document.getElementById("MediaPlayerContainer");
const title = document.querySelector('.SongTitle'); // element where track title appears
const progressBar = document.querySelector('#progress-bar'); // element where progress bar appears

function main() {

    const canvas = document.querySelector('#c');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        30,
        innerWidth / innerHeight,
        1,
        5000
    )
    const renderer = new THREE.WebGLRenderer({ canvas });

    //Set camera position
    camera.position.set(-1.3, 0.72, 1.2)
    camera.lookAt(0.35, 0.45, 0);

    //console.log(scene)
    console.log(camera)
    console.log(renderer)

    //Add Axes Helper
    // scene.add(new THREE.AxesHelper(500));

    scene.background = new THREE.Color(0x8B0000)

    renderer.setSize(innerWidth, innerHeight)
    renderer.setPixelRatio(devicePixelRatio)
    renderer.setClearColor(0xffffff, 1)

    // const controls = new OrbitControls( camera, renderer.domElement );
    // controls.enableDamping = true;
    //                 controls.minDistance = 1;
    //                 controls.maxDistance = 10;
    //                 controls.target.set( 0, 0.5, 0 );
    //                 controls.update();

    document.body.appendChild(renderer.domElement)
    const manager = new THREE.LoadingManager();
    const loader = new GLTFLoader(manager);
    loader.setMeshoptDecoder(MeshoptDecoder);
    manager.onLoad = function () {
        animate();
        $('#loading').hide();
    }
    let myObj;
    loader.load(modelPlayer,

        function (gltf) {
            myObj = gltf.scene;
            scene.add(myObj);
            myObj.position.set(0, 0, 0);
        }
    );

    let vinyl;
    loader.load(modelVinyl,

        function (gltf) {
            vinyl = gltf.scene;
            scene.add(vinyl);
            //renderer.render(scene, camera);
            vinyl.name = "vinyl";
            vinyl.position.set(-0.117, 0.3, 0.03);
            vinyl.rotation.z = Math.PI / 2;
            vinyl.scale.set(0.17, 0.17, 0.17);
        }
    );

    let table;
    loader.load(modelTable,

        function (gltf) {
            table = gltf.scene;
            scene.add(table);
            //renderer.render(scene, camera);
            table.name = "table";
            table.position.set(-6, -1.45, -0.4);
            table.scale.set(0.1, 0.1, 0.10);
        }
    );


    let tv;
    loader.load(modelTV,

        function (gltf) {
            tv = gltf.scene;
            scene.add(tv);
            //renderer.render(scene, camera);
            tv.name = "tv";
            tv.rotation.y = 0.8 * Math.PI;
            tv.position.set(2, 0.47, -0.5);
            tv.scale.set(0.0035, 0.0035, 0.0035);
        }
    );


    let recorder;
    loader.load(modelRecorder,

        function (gltf) {
            recorder = gltf.scene;
            scene.add(recorder);
            //renderer.render(scene, camera);
            recorder.name = "recorder";
            recorder.rotation.y = -Math.PI / 1.5;
            recorder.position.set(1.4, 0.52, 0.8);
            recorder.scale.set(0.003, 0.003, 0.003);
        }
    );

    let vinyl2;
    loader.load(modelVinyl2,

        function (gltf) {
            vinyl2 = gltf.scene;
            scene.add(vinyl2);
            //renderer.render(scene, camera);
            vinyl2.name = "vinyl2";
            vinyl2.rotation.y = Math.PI * 1.7;
            vinyl2.position.set(1.1, 0.29, -0.4);
            vinyl2.scale.set(2.7, 2.7, 2.7);
        }
    );

    let cassette;
    loader.load(modelCassette,

        function (gltf) {
            cassette = gltf.scene;
            scene.add(cassette);
            //renderer.render(scene, camera);
            cassette.name = "cassette";
            cassette.rotation.y = Math.PI * 1.5;
            cassette.position.set(0.7, 0.025, 0.7);
            cassette.scale.set(0.0005, 0.0005, 0.0005);
        }
    );

    const video = document.getElementById('video');
    // video.style.visibility = 'hidden';
    const videoTexture = new THREE.VideoTexture(video);
    const geometry2 = new THREE.PlaneGeometry(0.8, 0.6);
    const videoMaterial = new THREE.MeshBasicMaterial({ map: videoTexture, side: THREE.FrontSide, toneMapped: false });
    videoMaterial.needsUpdate = true;
    const plane2 = new THREE.Mesh(geometry2, videoMaterial);
    scene.add(plane2);
    plane2.rotation.y = -0.2 * Math.PI;
    plane2.position.set(1.75, 0.65, -0.23);



    const light = new THREE.PointLight(0xf5bbad, 0.2);
    light.position.set(0, 0.5, 0);
    scene.add(light);

    const SpotLight4 = new THREE.SpotLight(0xe49759, 0.5);
    SpotLight4.castShadow = true;
    SpotLight4.position.set(1.3, 0.7, 0.2);
    scene.add(SpotLight4);
    // const sphereSize = 1;
    // const pointLightHelper = new THREE.PointLightHelper( SpotLight4, sphereSize );
    // scene.add( pointLightHelper );

    const light2 = new THREE.AmbientLight(0x404040); // soft white light
    scene.add(light2);

    const spotlight1 = new THREE.SpotLight(0xe49759, 1.0);
    spotlight1.castShadow = true;
    scene.add(spotlight1);
    spotlight1.position.set(0, 3, -3);

    const spotlight2 = new THREE.SpotLight(0xe49759, 1.0);
    spotlight2.castShadow = true;
    scene.add(spotlight2);
    spotlight2.position.set(3, 3, 0);

    const spotlight3 = new THREE.SpotLight(0xe49759, 1.0);
    spotlight3.castShadow = true;
    scene.add(spotlight3);
    spotlight2.position.set(-3, 3, 0);


    //console.log(light)
    console.log(loader)

    //Create a line Circle
    function getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
    }


    var line;
    var line2;

    var geometry = new LineGeometry();


    var MAX_POINTS = 360;
    var drawCount = 0;
    var positions = new Float32Array(MAX_POINTS * 3); // 3 vertices per point

    geometry.setPositions(positions);

    var material = new LineMaterial({
        color: 0xba3d3d,
        linewidth: 0.004,
        alphaToCoverage: true,
        // opacity: 0.05,
    });
    line = new Line2(geometry, material);
    line2 = line.clone();
    console.log(line2);

    scene.add(line);
    line.position.set(-0.19, 0, 0.05);
    initPositions();
    function initPositions() {
        var positions = [];
        var x = 0;
        var y = 0;
        var z = 0;
        var index = 0;
        for (var i = 0, l = MAX_POINTS; i < l; i += 2) {
            x = Math.sin(i * (Math.PI / 180)) * radius;
            y = 0.37;
            z = Math.cos(i * (Math.PI / 180)) * radius;
            positions[index++] = x;
            positions[index++] = y;
            positions[index++] = z;
        }
        line.geometry.setPositions(positions)
    }
    //Update Positions
    function updatePositions() {
        var positions = [];
        var x = 0;
        var y = 0;
        var z = 0;
        var index = 0;


        //line1
        for (var i = 0, l = MAX_POINTS; i < l; i += 2) {

            x = Math.sin(i * (Math.PI / 180)) * radius;
            if (Math.sin(i * (Math.PI / 30)) > 0) {
                y = v * 0.005 * Math.sin(i * (Math.PI / 30)) + 0.37;
            } else {
                y = v * 0.001 * Math.sin(i * (Math.PI / 5)) + getRandomArbitrary(0.37, 0.4);
            }
            z = Math.cos(i * (Math.PI / 180)) * radius;

            positions[index++] = x;
            positions[index++] = y;
            positions[index++] = z;

        }

        line.geometry.setPositions(positions)

    }

    //dot Line
    var dotLine;
    var dotLine2;
    var Dot_MAX_POINTS = 360;
    var Dot_drawCount = 0;
    var Dot_positions = new Float32Array(Dot_MAX_POINTS * 3); // 3 vertices per point

    var Dot_geometry = new LineGeometry();

    Dot_geometry.setPositions(Dot_positions);

    var Dot_material = new LineMaterial({
        color: 0x68aeb8,
        linewidth: 0.0025,
        alphaToCoverage: true,
        // opacity: 0.05,
    });
    dotLine = new Line2(Dot_geometry, Dot_material);

    scene.add(dotLine);
    dotLine.position.set(-0.19, 0, 0.05);
    Dot_initPositions();
    function Dot_initPositions() {
        var Dot_positions = [];
        var x = 0;
        var y = 0;
        var z = 0;
        var index = 0;
        for (var i = 0, l = Dot_MAX_POINTS; i < l; i += 2) {
            x = Math.sin(i * (Math.PI / 180)) * dot_radius;
            y = 0.33;
            z = Math.cos(i * (Math.PI / 180)) * dot_radius;
            Dot_positions[index++] = x;
            Dot_positions[index++] = y;
            Dot_positions[index++] = z;
        }
        dotLine.geometry.setPositions(Dot_positions)
    }
    //Update Positions
    function Dot_updatePositions() {
        var positions = [];
        var x = 0;
        var y = 0;
        var z = 0;
        var index = 0;


        //line1
        for (var i = 0, l = 360; i < l; i += 2) {

            x = Math.sin(i * (Math.PI / 180)) * dot_radius;
            //y = v*0.005*Math.sin(i*(Math.PI/100/f)) + 0.37 + Math.abs(v*0.005*Math.sin(i*(Math.PI/100/f)));
            y = v * 0.0035 * Math.sin(i * f) + 0.33 + v * 0.0035;
            z = Math.cos(i * (Math.PI / 180)) * dot_radius;

            positions[index++] = x;
            positions[index++] = y;
            positions[index++] = z;

        }

        dotLine.geometry.setPositions(positions)

    }



    //Mouse Interaction
    var mouseX = 0, mouseY = 0;
    var windowHalfX = window.innerWidth / 2;
    var windowHalfY = window.innerHeight / 2;


    document.addEventListener('mousemove', onDocumentMouseMove, false);
    function onDocumentMouseMove(event) {

        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);
    }


    //Mouse click on vinyl
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    //click on the 3d objects as button
    let clickedObjects = [];

    function addClickedObject(object) {
        clickedObjects = []
        clickedObjects.push(object)
    }
    var lastMove = Date.now();
    function onClick(event) {
        if (Date.now() - lastMove < 60) { // 32 frames a second
            return;
        } else {
            lastMove = Date.now();
        }
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersectsClickVinyl2 = raycaster.intersectObject(vinyl2, true);

        if (intersectsClickVinyl2.length > 0) {
            const clickedObject = intersectsClickVinyl2[0].object;
            addClickedObject(clickedObject);
            //your function here
            $.confirm({
                title: '♬ ?',
                content: "Play Music: 五月天 - 擁抱.mp3",
                type: 'blue',
                typeAnimated: true,
                buttons: {
                    tryAgain: {
                        text: 'PLAY',
                        btnClass: 'btn-gray',
                        action: function () {
                            if (micOn) {
                                stopAudio();
                                micOn = false;
                            }
                            if (music != null && localMusic) {
                                music.currentTime = 0;
                                music.pause();
                            }
                            console.log("localMusic", localMusic);
                            if (!localMusic && audioCtx != null) {
                                audioCtx.close();
                            }
                            music = document.querySelector('audio');
                            if (!audioBind) {
                                localCtx = new AudioContext();
                                bind = localCtx.createMediaElementSource(music);
                                audioBind = true;
                            }
                            analyser = localCtx.createAnalyser();
                            data = new Uint8Array(analyser.frequencyBinCount);
                            bind.connect(analyser);
                            analyser.connect(localCtx.destination);
                            music.play();
                            title.innerHTML='擁抱.mp3';
                            localMusic = true;
                            iptMusic = false;
                            paused = false;
                            panel.style.visibility = 'visible';
                            button.style.visibility = 'visible';
                            button.innerHTML = "pause";
                            play();
                            console.log("DETECTED! Clicking on the vinyl 2");
                        }
                    },
                    close: {
                        text: 'Cancel',
                        btnClass: 'btn-gray',
                        action: function () {
                        }
                    }
                }
            });
        }
        render();

    }


    let selectedObjects = [];

    // 选中
    function addSelectedObject(object) {
        selectedObjects = []
        selectedObjects.push(object)
    }
    // 光标移动

    function onPointerMove(event) {
        if (Date.now() - lastMove < 300) { // 32 frames a second
            return;
        } else {
            lastMove = Date.now();
        }
        if (event.isPrimary === false) return
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
        checkIntersection()
    }

    function checkIntersection() {
        vinyl.isPickable = false;
        table.isPickable = false;
        cassette.isPickable = false;
        tv.isPickable = false;

        raycaster.setFromCamera(mouse, camera);
        const intersectsHover = raycaster.intersectObject(vinyl2, true);
        if (intersectsHover.length > 0) {
            $('html,body').css('cursor', 'pointer');
            const selectedObject = intersectsHover[0].object;
            addSelectedObject(selectedObject);
            new TWEEN.Tween(vinyl2.position)
                .to(
                    {
                        x: 1.1,
                        y: 0.34,
                        z: -0.4,
                    },
                    300)
                .start()
            new TWEEN.Tween(vinyl2.scale)
                .to(
                    {
                        x: 2.85,
                        y: 2.85,
                        z: 2.85,
                    },
                    300)
                .easing(TWEEN.Easing.Cubic.Out)
                .start()
        }
        else {
            $('html,body').css('cursor', 'default');
            //if there is no intersection, transform back to original size
            new TWEEN.Tween(vinyl2.position)
                .to(
                    {
                        x: 1.1,
                        y: 0.29,
                        z: -0.4,
                    },
                    300
                )
                .start()
            new TWEEN.Tween(vinyl2.scale)
                .to(
                    {
                        x: 2.7,
                        y: 2.7,
                        z: 2.7,
                    },
                    300
                )
                .easing(TWEEN.Easing.Cubic.Out)
                .start()
        }
    }

    //Animation, fps is 60
    function animate() {
        console.log("local", localMusic, "mic", micOn, "out", iptMusic, "paused", paused);
        requestAnimationFrame(animate);
        // if (myObj != null){

        //     myObj.rotation.x +=  ( -mouseX/19200 - myObj.rotation.x ) * .008;
        //     myObj.rotation.y +=  (  mouseY/6400 - myObj.rotation.y ) * .008;      
        // }

        if (vinyl != null) {
            //target.z = camera.position.z; // assuming the camera is located at ( 0, 0, z );

            vinyl.rotation.x += (-mouseX / 12800 - vinyl.rotation.x) * .02;
            vinyl.rotation.y += (mouseY / 4800 - vinyl.rotation.y) * .02;
        }

        if (line != null) {
            //target.z = camera.position.z; // assuming the camera is located at ( 0, 0, z );
            drawCount = (drawCount + 60) % MAX_POINTS;

            line.geometry.maxInstancedCount = drawCount;

            if (drawCount === 0) {
                // periodically, generate new data
                //radius = getRandomArbitrary(0.4, 0.48)

                updatePositions();

            }
            line.rotation.y -= (Math.PI / 180) * 0.15;
            // line.rotation.x +=  ( -mouseX/6400 - line.rotation.x ) * .01;
            // line.rotation.y +=  ( mouseY/2400 - line.rotation.y ) * .01; 

        }

        if (dotLine != null) {
            //target.z = camera.position.z; // assuming the camera is located at ( 0, 0, z );
            Dot_drawCount = (Dot_drawCount + 60) % Dot_MAX_POINTS;

            dotLine.geometry.maxInstancedCount = Dot_drawCount;

            if (Dot_drawCount === 0) {

                // periodically, generate new data
                //radius = getRandomArbitrary(0.4, 0.48)

                Dot_updatePositions();

            }
            dotLine.rotation.y -= (Math.PI / 180) * 0.1;
            // line.rotation.x +=  ( -mouseX/6400 - line.rotation.x ) * .01;
            // line.rotation.y +=  ( mouseY/2400 - line.rotation.y ) * .01; 

        }
        renderer.domElement.addEventListener('pointermove', onPointerMove.bind(this))
        renderer.domElement.addEventListener('click', onClick, false);
        TWEEN.update();
        render();
        // controls.update();
    }


    function render() {

        renderer.render(scene, camera);

    }
}

main();
function play() {
    analyser.getByteFrequencyData(data);
    var idx = 0;
    for (var j = 0; j < analyser.frequencyBinCount; j++) {
        if (data[j] > data[idx]) {
            idx = j;
        }
    }
    if (localMusic) {
        var frequency = idx * localCtx.sampleRate / analyser.fftSize;
    } else {
        var frequency = idx * audioCtx.sampleRate / analyser.fftSize;
    }
    function getAverageVolume(array) {
        var values = 0;
        var average;

        var length = array.length;

        for (var i = 0; i < length; i++) {
            values += array[i];
        }

        average = values / length;
        return average;
    }
    v = getAverageVolume(data);
    f = (frequency - 20) / 1000;
    radius = f * 0.07 + 0.4;
    density = Math.ceil(frequency);
    // console.log(f);
    requestAnimationFrame(play);
}

button.onclick = function () {
    if (localMusic) {
        if (paused) {
            music.play();
            paused = false;
            button.innerHTML = "pause";
        }
        else {
            music.pause();
            paused = true;
            button.innerHTML = "resume";
        }
    } else {
        if (paused) {
            play1();
            button.innerHTML = "pause";
        }
        else {
            stop1();
            button.innerHTML = "resume";
        }
    }
};
function stopAudio() {
    audioCtx = new AudioContext();
    analyser = audioCtx.createAnalyser();
    source = audioCtx.createBufferSource();
}

progressBar.addEventListener('change', (event) => {
    if (localMusic) {
        music.currentTime = progressBar.value;
    } else {
        pausedAt = progressBar.value * 1000;
        source.stop();
        play1();
    }
});
function play1() {
    source = audioCtx.createBufferSource();
    source.connect(analyser);
    analyser.connect(audioCtx.destination);

    source.buffer = buff;

    source.loop = false;
    paused = false;

    if (pausedAt) {
        startedAt = Date.now() - pausedAt;
        source.start(0, pausedAt / 1000);
    }
    else {
        startedAt = Date.now();
        source.start(0);
    }
};

function stop1() {
    source.stop(0);
    pausedAt = Date.now() - startedAt;
    paused = true;
};
$(document).ready(function () {
    panel.style.visibility = 'hidden';
    button.style.visibility = 'hidden';
    console.log("Document ready!");
    const mic = document.getElementById("mic");
    mic.onclick = function () {
        if (micOn == false) {
            cfmMic();
        } else {
            stopAudio();
            micOn = false;
            micButton.innerHTML = "Microphone: Off";
            console.log("Stop mic!", micOn);
        }
    };
    function useMic() {
        audioCtx = new AudioContext();
        analyser = audioCtx.createAnalyser();
        navigator.mediaDevices.getUserMedia({ audio: true, video: false })
            .then(function (stream) {
                audioCtx = new AudioContext();
                source = audioCtx.createMediaStreamSource(stream);
                analyser = audioCtx.createAnalyser();
                source.connect(analyser);
                var data = new Uint8Array(analyser.frequencyBinCount);
                function play() {
                    analyser.getByteFrequencyData(data);
                    var idx = 0;
                    for (var j = 0; j < analyser.frequencyBinCount; j++) {
                        if (data[j] > data[idx]) {
                            idx = j;
                        }
                    }
                    var values = 0;
                    var length = data.length;
                    for (var i = 0; i < length; i++) {
                        values += data[i];
                    }
                    v = values / length;
                    var frequency = idx * audioCtx.sampleRate / analyser.fftSize;
                    f = (frequency - 20) / 1000;
                    radius = f * 0.035 + 0.4;
                    density = Math.ceil(frequency);
                    requestAnimationFrame(play);
                }
                play();
            }).catch(
                (error) => { console.log(error); }
            );
    }
    function cfmMic() {
        $.confirm({
            title: 'Open Mic?',
            content: 'You Will Input Audio From Mic, Say Allo',
            type: 'blue',
            typeAnimated: true,
            buttons: {
                OK: {
                    text: 'OK',
                    btnClass: 'btn-gray',
                    action: function () {
                        if (music != null) {
                            panel.style.visibility = 'hidden';
                            button.style.visibility = 'hidden';
                            if (localMusic) {
                                music.pause();
                                music.currentTime = 0;
                            } else {
                                source.stop();
                            }
                            music = null;
                            stopAudio();
                            console.log('Stop music!');
                        }
                        micOn = true;
                        iptMusic = false;
                        localMusic = false;
                        micButton.innerHTML = "Microphone: On";
                        useMic();
                        console.log("Open mic!", micOn);
                    }
                },
                Cancel: {
                    text: 'Cancel',
                    btnClass: 'btn-gray',
                    action: function () {

                    }
                }
            }
        });
    }

    function cfm() {
        $.confirm({
            title: '♬ ?',
            content: ipt.name,
            type: 'blue',
            typeAnimated: true,
            buttons: {
                tryAgain: {
                    text: 'PLAY',
                    btnClass: 'btn-gray',
                    action: function () {
                        micOn = false;
                        if (localMusic) {
                            music.pause();
                            music.currentTime = 0;
                            localMusic = false;
                        }
                        if (iptMusic) {
                            source.stop(0);
                        }
                        audioCtx = new AudioContext();
                        analyser = audioCtx.createAnalyser();
                        source = audioCtx.createBufferSource();
                        source.connect(analyser);
                        analyser.connect(audioCtx.destination);
                        button.style.visibility = 'visible';
                        panel.style.visibility = 'visible';
                        music = ipt;
                        title.innerHTML=music.name;
                        console.log(music);
                        console.log("File recieved!");
                        fr = new FileReader();
                        pausedAt = 0;
                        fr.readAsArrayBuffer(music);
                        iptMusic = true;
                        fr.onload = function (e) {
                            arrayBuffer = fr.result;
                            audioCtx.decodeAudioData(arrayBuffer, function (buffer) {
                                len = buffer.duration
                                buff = buffer;
                                source.buffer = buffer;
                                source.loop = false;
                            });
                            // play the source music
                            paused = false;

                            if (pausedAt) {
                                startedAt = Date.now() - pausedAt;
                                source.start(0, pausedAt / 1000);
                            }
                            else {
                                startedAt = Date.now();
                                source.start(0);
                            }
                            data = new Uint8Array(analyser.frequencyBinCount);
                            play();


                        };
                    }
                },
                close: {
                    text: 'Cancel',
                    btnClass: 'btn-gray',
                    action: function () {
                        if (micOn == true) {
                            useMic();
                        }
                    }
                }
            }
        });
    }



    const dropArea = document.getElementById("c");
    dropArea.addEventListener('dragover', (event) => {
        console.log("over");
        event.stopPropagation();
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';
    });
    dropArea.addEventListener('drop', (event) => {
        event.stopPropagation();
        event.preventDefault();
        console.log("drop");
        ipt = event.dataTransfer.files[0]
        if (ipt.type == "audio/mpeg") {
            cfm();
        } else {
            alert("Please make sure selected file is mp3 format")
        }
    });
    // const song = document.querySelector('#song'); // audio object



    // update progressBar.max to song object's duration, same for progressBar.value, update currentTime/duration DOM
    function updateProgressValue() {
        if (music != null && localMusic) {
            progressBar.max = music.duration;

            progressBar.value = music.currentTime;
            document.querySelector('.currentTime').innerHTML = (formatTime(Math.floor(music.currentTime)));
            if (document.querySelector('.durationTime').innerHTML === "NaN:NaN") {
                document.querySelector('.durationTime').innerHTML = "0:00";
            } else {
                document.querySelector('.durationTime').innerHTML = (formatTime(Math.floor(music.duration)));
            }
        } else {
            progressBar.max = len;
            if (pausedAt != null) {
                if (!paused) {
                    pausedAt += 500;
                }
                if(pausedAt>len*1000){
                    pausedAt=0;
                    startedAt=0;
                    paused=true;
                    button.innerHTML="Start";
                }
                progressBar.value = pausedAt / 1000;
                document.querySelector('.currentTime').innerHTML = (formatTime(Math.floor(pausedAt / 1000)));
            } else {
                progressBar.value = 0;
                document.querySelector('.currentTime').innerHTML = (formatTime(0));
            }
            if (document.querySelector('.durationTime').innerHTML === "NaN:NaN") {
                document.querySelector('.durationTime').innerHTML = "0:00";
            } else {
                document.querySelector('.durationTime').innerHTML = (formatTime(Math.floor(len)));
            }
        }
    };

    // convert music.currentTime and song.duration into MM:SS format
    function formatTime(seconds) {
        let min = Math.floor((seconds / 60));
        let sec = Math.floor(seconds - (min * 60));
        if (sec < 10) {
            sec = `0${sec}`;
        };
        return `${min}:${sec}`;
    };

    // run updateProgressValue function every 1/2 second to show change in progressBar and music.currentTime on the DOM
    setInterval(updateProgressValue, 500);

    // function where progressBar.value is changed when slider thumb is dragged without auto-playing audio



    // Make the DIV element draggable:
    var PADDING = 4;

    var rect;
    var viewport = {
        bottom: 0,
        left: 0,
        right: 0,
        top: 0
    }

    //Make the DIV element draggagle:
    dragElement(document.getElementById(("MediaPlayerContainer")));

    function dragElement(elmnt) {
        var pos1 = 0,
            pos2 = 0,
            pos3 = 0,
            pos4 = 0;
        if (document.getElementById(elmnt.id + "header")) {
            /* if present, the header is where you move the DIV from:*/
            document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
        } else {
            /* otherwise, move the DIV from anywhere inside the DIV:*/
            elmnt.onmousedown = dragMouseDown;
        }

        function dragMouseDown(e) {
            e = e || window.event;
            // get the mouse cursor position at startup:
            pos3 = e.clientX;
            pos4 = e.clientY;

            // store the current viewport and element dimensions when a drag starts
            rect = elmnt.getBoundingClientRect();
            viewport.bottom = window.innerHeight - PADDING;
            viewport.left = PADDING;
            viewport.right = window.innerWidth - PADDING;
            viewport.top = PADDING;

            document.onmouseup = closeDragElement;
            // call a function whenever the cursor moves:
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            // calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;

            // check to make sure the element will be within our viewport boundary
            var newLeft = elmnt.offsetLeft - pos1;
            var newTop = elmnt.offsetTop - pos2;

            if (newLeft < viewport.left ||
                newTop < viewport.top ||
                newLeft + rect.width > viewport.right ||
                newTop + rect.height > viewport.bottom
            ) {
                // the element will hit the boundary, do nothing...
            } else {
                // set the element's new position:
                elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
                elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
            }
        }

        function closeDragElement() {
            /* stop moving when mouse button is released:*/
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }
});
