import { useEffect, useRef, useState } from "react";

import gsap from "gsap";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

import { useIntro } from "@/lib/intro-context";
import { getLenis } from "@/components/smooth-scroll";

const MODEL_PATH = "/model/model.glb";
const CAMERA_FOV = 36;
const CAMERA_DISTANCE = 7.5;
const ACCENT_COLOR_HEX = 0x1500e1;

function calculateResponsiveScale(viewportWidth: number): number {
	if (viewportWidth < 640) return 0.62;
	if (viewportWidth < 1024) return 0.82;
	return 1.05;
}

function centerModelGeometry(scene: THREE.Group): void {
	const boundingBox = new THREE.Box3().setFromObject(scene);
	const centerVector = boundingBox.getCenter(new THREE.Vector3());
	scene.position.sub(centerVector);
}

function createStudioLighting(scene: THREE.Scene): void {
	const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
	scene.add(ambientLight);

	const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
	keyLight.position.set(4, 7, 5);
	scene.add(keyLight);

	const fillLight = new THREE.DirectionalLight(0xffffff, 0.8);
	fillLight.position.set(-5, -2, -2);
	scene.add(fillLight);

	const rimLight = new THREE.DirectionalLight(ACCENT_COLOR_HEX, 3.8);
	rimLight.position.set(0, 5, -6);
	scene.add(rimLight);
}

function disposeHierarchy(rootObject: THREE.Object3D): void {
	rootObject.traverse((object) => {
		if (!(object instanceof THREE.Mesh)) return;
		object.geometry.dispose();
		if (Array.isArray(object.material)) {
			for (const material of object.material) {
				material.dispose();
			}
		} else {
			object.material.dispose();
		}
	});
}

export function Scene() {
	const containerRef = useRef<HTMLDivElement>(null);
	const [isDesktop, setIsDesktop] = useState(false);
	const [isReady, setIsReady] = useState(false);
	const { notifyModelLoaded, isLoaded } = useIntro();
	const modelPivotRef = useRef<THREE.Group | null>(null);
	const hasAnimatedInRef = useRef(false);

	useEffect(() => {
		const mediaQuery = window.matchMedia("(min-width: 768px)");
		setIsDesktop(mediaQuery.matches);

		if (!mediaQuery.matches) {
			notifyModelLoaded();
		}

		const handleMediaChange = (event: MediaQueryListEvent) => {
			setIsDesktop(event.matches);
			if (!event.matches) {
				notifyModelLoaded();
			}
		};

		mediaQuery.addEventListener("change", handleMediaChange);
		return () => {
			mediaQuery.removeEventListener("change", handleMediaChange);
		};
	}, [notifyModelLoaded]);

	useEffect(() => {
		if (!isDesktop || !isLoaded || hasAnimatedInRef.current) return;
		hasAnimatedInRef.current = true;
		setIsReady(true);

		const modelPivot = modelPivotRef.current;
		if (!modelPivot) return;

		const prefersReducedMotion = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;

		if (prefersReducedMotion) {
			modelPivot.scale.setScalar(calculateResponsiveScale(window.innerWidth));
			modelPivot.rotation.set(0, 0, 0);
			return;
		}

		const tl = gsap.timeline();
		tl.to(modelPivot.scale, {
			x: calculateResponsiveScale(window.innerWidth),
			y: calculateResponsiveScale(window.innerWidth),
			z: calculateResponsiveScale(window.innerWidth),
			duration: 1.5,
			ease: "power3.out",
		}).to(
			modelPivot.rotation,
			{
				y: 0,
				x: 0,
				duration: 1.8,
				ease: "power3.out",
			},
			0,
		);
	}, [isDesktop, isLoaded]);

	useEffect(() => {
		if (!isDesktop) return;
		const container = containerRef.current;
		if (!container) return;

		let isDestroyed = false;
		let animationFrameId = 0;

		const prefersReducedMotion = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;

		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(
			CAMERA_FOV,
			window.innerWidth / window.innerHeight,
			0.1,
			100,
		);
		camera.position.set(0, 0, CAMERA_DISTANCE);

		const renderer = new THREE.WebGLRenderer({
			alpha: true,
			antialias: true,
			powerPreference: "high-performance",
		});
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		renderer.toneMapping = THREE.ACESFilmicToneMapping;
		renderer.toneMappingExposure = 1.15;
		renderer.outputColorSpace = THREE.SRGBColorSpace;
		container.appendChild(renderer.domElement);

		const pmremGenerator = new THREE.PMREMGenerator(renderer);
		pmremGenerator.compileEquirectangularShader();
		const roomEnvironment = new RoomEnvironment();
		const envRenderTarget = pmremGenerator.fromScene(roomEnvironment);
		scene.environment = envRenderTarget.texture;

		createStudioLighting(scene);

		const mouseGroup = new THREE.Group();
		const scrollGroup = new THREE.Group();
		const idleGroup = new THREE.Group();
		const modelPivot = new THREE.Group();
		modelPivotRef.current = modelPivot;

		scene.add(mouseGroup);
		mouseGroup.add(scrollGroup);
		scrollGroup.add(idleGroup);
		idleGroup.add(modelPivot);

		const baseScale = calculateResponsiveScale(window.innerWidth);
		if (prefersReducedMotion) {
			modelPivot.scale.setScalar(baseScale);
		} else {
			modelPivot.scale.set(0, 0, 0);
			modelPivot.rotation.y = -Math.PI * 2;
			modelPivot.rotation.x = 0.45;
		}

		const gltfLoader = new GLTFLoader();
		gltfLoader.load(
			MODEL_PATH,
			(gltf) => {
				if (isDestroyed) return;
				centerModelGeometry(gltf.scene);
				modelPivot.add(gltf.scene);
				notifyModelLoaded();
			},
			undefined,
			(error) => {
				console.error("Failed to load 3D model:", error);
				notifyModelLoaded();
			},
		);

		let targetMouseX = 0;
		let targetMouseY = 0;
		let currentMouseX = 0;
		let currentMouseY = 0;

		const handleMouseMove = (event: MouseEvent) => {
			targetMouseX = (event.clientX / window.innerWidth - 0.5) * 2;
			targetMouseY = (event.clientY / window.innerHeight - 0.5) * 2;
		};

		const handleMouseLeave = () => {
			targetMouseX = 0;
			targetMouseY = 0;
		};

		window.addEventListener("mousemove", handleMouseMove, { passive: true });
		document.addEventListener("mouseleave", handleMouseLeave);

		let targetScrollRotationY = 0;
		let targetScrollRotationX = 0;
		let targetScrollRotationZ = 0;
		let currentScrollRotationY = 0;
		let currentScrollRotationX = 0;
		let currentScrollRotationZ = 0;

		const updateScrollTarget = (scrollY: number) => {
			targetScrollRotationY = scrollY * 0.0035;
			targetScrollRotationX = Math.sin(scrollY * 0.0014) * 0.32;
			targetScrollRotationZ = Math.cos(scrollY * 0.0011) * 0.16;
		};

		const handleWindowScroll = () => {
			updateScrollTarget(window.scrollY);
		};

		window.addEventListener("scroll", handleWindowScroll, { passive: true });

		const lenisInstance = getLenis();
		const unsubscribeLenis = lenisInstance?.on("scroll", (event: { scroll: number }) => {
			updateScrollTarget(event.scroll);
		});

		const handleResize = () => {
			const width = window.innerWidth;
			const height = window.innerHeight;
			camera.aspect = width / height;
			camera.updateProjectionMatrix();
			renderer.setSize(width, height);
			if (hasAnimatedInRef.current || prefersReducedMotion) {
				modelPivot.scale.setScalar(calculateResponsiveScale(width));
			}
		};

		window.addEventListener("resize", handleResize);

		const clock = new THREE.Clock();

		const render = () => {
			if (isDestroyed) return;
			animationFrameId = requestAnimationFrame(render);

			const delta = clock.getDelta();
			const elapsed = clock.getElapsedTime();

			if (!prefersReducedMotion) {
				const mouseLerpFactor = 1 - Math.exp(-6 * delta);
				currentMouseX += (targetMouseX - currentMouseX) * mouseLerpFactor;
				currentMouseY += (targetMouseY - currentMouseY) * mouseLerpFactor;

				mouseGroup.rotation.y = currentMouseX * 0.45;
				mouseGroup.rotation.x = -currentMouseY * 0.32;
				mouseGroup.position.x = currentMouseX * 0.22;
				mouseGroup.position.y = -currentMouseY * 0.16;

				const scrollLerpFactor = 1 - Math.exp(-7 * delta);
				currentScrollRotationY +=
					(targetScrollRotationY - currentScrollRotationY) * scrollLerpFactor;
				currentScrollRotationX +=
					(targetScrollRotationX - currentScrollRotationX) * scrollLerpFactor;
				currentScrollRotationZ +=
					(targetScrollRotationZ - currentScrollRotationZ) * scrollLerpFactor;

				scrollGroup.rotation.y = currentScrollRotationY;
				scrollGroup.rotation.x = currentScrollRotationX;
				scrollGroup.rotation.z = currentScrollRotationZ;

				idleGroup.position.y = Math.sin(elapsed * 1.3) * 0.07;
				idleGroup.rotation.y = Math.sin(elapsed * 0.5) * 0.04;
			}

			renderer.render(scene, camera);
		};

		render();

		return () => {
			isDestroyed = true;
			cancelAnimationFrame(animationFrameId);

			window.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseleave", handleMouseLeave);
			window.removeEventListener("scroll", handleWindowScroll);
			window.removeEventListener("resize", handleResize);
			if (typeof unsubscribeLenis === "function") {
				unsubscribeLenis();
			}

			disposeHierarchy(scene);
			roomEnvironment.dispose();
			envRenderTarget.dispose();
			pmremGenerator.dispose();
			renderer.dispose();

			if (renderer.domElement.parentElement === container) {
				container.removeChild(renderer.domElement);
			}
		};
	}, [isDesktop]);

	if (!isDesktop) return null;

	return (
		<div
			ref={containerRef}
			className={`scene-container ${isReady ? "scene-container--ready" : ""}`}
			aria-hidden="true"
		/>
	);
}
