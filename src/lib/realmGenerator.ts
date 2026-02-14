import * as THREE from 'three';

export interface RealmConfig {
  mode: number;
  count: number;
  seed: number;
  particleSize: number;
}

export function generateRealmGeometry(config: RealmConfig): THREE.BufferGeometry {
  const { mode, count, seed } = config;
  const geo = new THREE.BufferGeometry();
  const pos: number[] = [];

  const seededRandom = (index: number, offset: number = 0) => {
    const x = Math.sin((seed + index + offset) * 9999.0) * 10000.0;
    return x - Math.floor(x);
  };

  const random = (min: number, max: number, index: number = 0) => {
    return min + seededRandom(index) * (max - min);
  };

  for (let i = 0; i < count; i++) {
    const u = (i / count) * Math.PI * 2 + seed * 0.001;
    const v = ((i % 100) / 100) * Math.PI * 2;
    const t = i / count;

    switch (mode % 67) {
      case 0: {
        const p = 2 + (seed % 3), q = 3 + (seed % 4);
        const rK = (150 + (seed % 100)) * (2 + Math.cos(q * u));
        pos.push(
          rK * Math.cos(p * u),
          rK * Math.sin(p * u),
          (150 + (seed % 100)) * Math.sin(q * u)
        );
        break;
      }
      case 1: {
        const spiralTightness = 0.15 + seededRandom(0) * 0.15;
        const zS = i * spiralTightness - 1000;
        const rS = (150 + (seed % 150)) + Math.sin(i * 0.01 + seed * 0.01) * (30 + (seed % 50));
        pos.push(
          rS * Math.cos(i * spiralTightness),
          rS * Math.sin(i * spiralTightness),
          zS
        );
        break;
      }
      case 2: {
        const hDNA = i * 0.1 - 750;
        const rDNA = 150;
        const off = (i % 2 === 0) ? 0 : Math.PI;
        pos.push(
          rDNA * Math.cos(i * 0.05 + off),
          hDNA,
          rDNA * Math.sin(i * 0.05 + off)
        );
        break;
      }
      case 3: {
        const gridW = 120;
        const spacing = 15;
        pos.push(
          (i % gridW) * spacing - (gridW * spacing) / 2,
          Math.sin(i * 0.05 + seed * 0.01) * 100,
          Math.floor(i / gridW) * spacing - (gridW * spacing) / 2
        );
        break;
      }
      case 4: {
        const phi = Math.acos(-1 + (2 * i) / count);
        const theta = Math.sqrt(count * Math.PI) * phi;
        const radius = 300 + (seed % 200);
        pos.push(
          radius * Math.cos(theta) * Math.sin(phi),
          radius * Math.sin(theta) * Math.sin(phi),
          radius * Math.cos(phi)
        );
        break;
      }
      case 5: {
        const angle = i * 137.508 * (Math.PI / 180);
        const radius = Math.sqrt(i) * 15;
        pos.push(
          radius * Math.cos(angle),
          i * 2 - count,
          radius * Math.sin(angle)
        );
        break;
      }
      case 6: {
        const rC = 300;
        pos.push(
          rC * Math.cos(u),
          (Math.random() * 2 - 1) * 1000,
          rC * Math.sin(u)
        );
        break;
      }
      case 7: {
        const size = 400;
        pos.push(
          (Math.random() * 2 - 1) * size,
          (i % 2 === 0 ? 1 : -1) * size,
          (Math.random() * 2 - 1) * size
        );
        break;
      }
      case 8: {
        const turns = 5;
        const angle = i * turns * 2 * Math.PI / count;
        const r = 50 + i * 0.5;
        const height = i * 2 - count;
        pos.push(
          r * Math.cos(angle),
          height,
          r * Math.sin(angle)
        );
        break;
      }
      case 9: {
        const latticeSize = 20;
        const spacing = 40;
        const x = (i % latticeSize) * spacing - (latticeSize * spacing) / 2;
        const y = (Math.floor(i / latticeSize) % latticeSize) * spacing - (latticeSize * spacing) / 2;
        const z = (Math.floor(i / (latticeSize * latticeSize)) % latticeSize) * spacing - (latticeSize * spacing) / 2;
        pos.push(x, y, z);
        break;
      }
      case 10: {
        const majorR = 300;
        const minorR = 100;
        pos.push(
          (majorR + minorR * Math.cos(v)) * Math.cos(u),
          minorR * Math.sin(v),
          (majorR + minorR * Math.cos(v)) * Math.sin(u)
        );
        break;
      }
      case 11: {
        const scale = 500;
        const x = (Math.random() * 2 - 1) * scale;
        const y = (Math.random() * 2 - 1) * scale;
        const z = (Math.random() * 2 - 1) * scale;
        const bubbleSize = Math.random() * 50 + 10;
        pos.push(
          x + Math.cos(seed + i) * bubbleSize,
          y + Math.sin(seed + i * 2) * bubbleSize,
          z + Math.cos(seed + i * 3) * bubbleSize
        );
        break;
      }
      case 12: {
        const pulseRadius = 250 + Math.sin(i * 0.01 + seed * 0.01) * 100;
        const phi = Math.acos(-1 + (2 * i) / count);
        const theta = Math.sqrt(count * Math.PI) * phi;
        pos.push(
          pulseRadius * Math.cos(theta) * Math.sin(phi),
          pulseRadius * Math.sin(theta) * Math.sin(phi),
          pulseRadius * Math.cos(phi)
        );
        break;
      }
      case 13: {
        const warpDepth = i * 2 - count;
        const warpRadius = 200 + Math.abs(warpDepth) * 0.3;
        const angle = i * 0.1 + seed * 0.001;
        pos.push(
          warpRadius * Math.cos(angle),
          warpDepth,
          warpRadius * Math.sin(angle)
        );
        break;
      }
      case 14: {
        const columns = 50;
        const xPos = (i % columns) * 30 - (columns * 15);
        const zPos = Math.floor(i / columns) * 30 - 750;
        const yPos = seededRandom(i) * 1500 - 750;
        pos.push(xPos, yPos, zPos);
        break;
      }
      case 15: {
        const starRadius = seededRandom(i, 0) * 800 + 200;
        const starPhi = seededRandom(i, 1) * Math.PI;
        const starTheta = seededRandom(i, 2) * Math.PI * 2;
        pos.push(
          starRadius * Math.sin(starPhi) * Math.cos(starTheta),
          starRadius * Math.sin(starPhi) * Math.sin(starTheta),
          starRadius * Math.cos(starPhi)
        );
        break;
      }
      case 16: {
        const towerHeight = i * 3 - count * 1.5;
        const towerRadius = 150 + Math.abs(towerHeight) * 0.1;
        const towerAngle = i * 0.08;
        pos.push(
          towerRadius * Math.cos(towerAngle),
          towerHeight,
          towerRadius * Math.sin(towerAngle)
        );
        break;
      }
      case 17: {
        const globeR = 300;
        const boltOffset = seededRandom(i) * 50;
        pos.push(
          (globeR + boltOffset) * Math.cos(u) * Math.sin(v),
          (globeR + boltOffset) * Math.sin(u) * Math.sin(v),
          (globeR + boltOffset) * Math.cos(v)
        );
        break;
      }
      case 18: {
        const branch = Math.floor(i / (count / 8));
        const branchAngle = (branch / 8) * Math.PI * 2;
        const branchDist = (i % (count / 8)) * 2;
        pos.push(
          branchDist * Math.cos(branchAngle),
          i * 1.5 - count * 0.75,
          branchDist * Math.sin(branchAngle)
        );
        break;
      }
      case 19: {
        const gridSize = 40;
        const gridX = (i % gridSize) * 40 - (gridSize * 20);
        const gridZ = Math.floor(i / gridSize) * 40 - (gridSize * 20);
        const gridY = Math.sin(gridX * 0.05 + seed * 0.001) * 50 + Math.cos(gridZ * 0.05) * 50;
        pos.push(gridX, gridY, gridZ);
        break;
      }
      case 20: {
        const node = Math.floor(seededRandom(i, 0) * 20);
        const nodeAngle = (node / 20) * Math.PI * 2;
        const nodeRadius = 400;
        const linkDist = seededRandom(i, 1) * 300;
        pos.push(
          nodeRadius * Math.cos(nodeAngle) + linkDist * Math.cos(u),
          seededRandom(i, 2) * 400 - 200,
          nodeRadius * Math.sin(nodeAngle) + linkDist * Math.sin(u)
        );
        break;
      }
      case 21: {
        const cubeSize = 250;
        const w = (seededRandom(i, 0) * 2 - 1) * cubeSize;
        const x = (seededRandom(i, 1) * 2 - 1) * cubeSize;
        const y = (seededRandom(i, 2) * 2 - 1) * cubeSize;
        const z = (seededRandom(i, 3) * 2 - 1) * cubeSize;
        const projection = 1 / (2 - w / 500);
        pos.push(x * projection, y * projection, z * projection);
        break;
      }
      case 22: {
        const waveLength = count / 10;
        const waveX = (i % waveLength) * 10 - (waveLength * 5);
        const waveY = Math.sin(i * 0.1 + seed * 0.01) * 200;
        const waveZ = Math.cos(i * 0.05) * 150 + (Math.floor(i / waveLength) * 50 - 250);
        pos.push(waveX, waveY, waveZ);
        break;
      }
      case 23: {
        const mobiusR = 200;
        const mobiusW = 100;
        const mobiusU = (i / count) * Math.PI * 2;
        const mobiusV = ((i % 50) / 50 - 0.5) * mobiusW;
        pos.push(
          (mobiusR + mobiusV * Math.cos(mobiusU / 2)) * Math.cos(mobiusU),
          mobiusV * Math.sin(mobiusU / 2),
          (mobiusR + mobiusV * Math.cos(mobiusU / 2)) * Math.sin(mobiusU)
        );
        break;
      }
      case 24: {
        const armAngle = i * 0.02 + (Math.floor(i / (count / 4)) * Math.PI / 2);
        const armRadius = 100 + (i % (count / 4)) * 0.8;
        pos.push(
          armRadius * Math.cos(armAngle),
          seededRandom(i) * 100 - 50,
          armRadius * Math.sin(armAngle)
        );
        break;
      }
      case 25: {
        const ringMajor = 350;
        const ringMinor = 80 + Math.sin(i * 0.05) * 20;
        pos.push(
          (ringMajor + ringMinor * Math.cos(v)) * Math.cos(u),
          ringMinor * Math.sin(v) + Math.sin(u * 3) * 30,
          (ringMajor + ringMinor * Math.cos(v)) * Math.sin(u)
        );
        break;
      }
      case 26: {
        const caveW = 30, caveH = 30, caveD = 30;
        const cx = (i % caveW) * 40 - (caveW * 20);
        const cy = (Math.floor(i / caveW) % caveH) * 40 - (caveH * 20);
        const cz = (Math.floor(i / (caveW * caveH)) % caveD) * 40 - (caveD * 20);
        const crystalGrow = seededRandom(i) * 50;
        pos.push(cx + crystalGrow, cy, cz);
        break;
      }
      case 27: {
        const neuronId = Math.floor(seededRandom(i, 0) * 50);
        const neuronX = seededRandom(neuronId, 0) * 800 - 400;
        const neuronY = seededRandom(neuronId, 1) * 800 - 400;
        const neuronZ = seededRandom(neuronId, 2) * 800 - 400;
        const axonLength = seededRandom(i, 1) * 150;
        const axonAngle = seededRandom(i, 2) * Math.PI * 2;
        pos.push(
          neuronX + axonLength * Math.cos(axonAngle),
          neuronY + axonLength * Math.sin(axonAngle),
          neuronZ
        );
        break;
      }
      case 28: {
        const vortexAngle = i * 0.05 + seed * 0.001;
        const vortexRadius = 300 - Math.abs(i - count / 2) * 0.3;
        const vortexDepth = (i - count / 2) * 2;
        pos.push(
          vortexRadius * Math.cos(vortexAngle),
          vortexDepth,
          vortexRadius * Math.sin(vortexAngle)
        );
        break;
      }
      case 29: {
        const isVertical = i % 2 === 0;
        const laserPos = (i % 50) * 40 - 1000;
        const laserCross = Math.floor(i / 50) * 40 - 400;
        pos.push(
          isVertical ? laserCross : laserPos,
          seededRandom(i) * 200 - 100,
          isVertical ? laserPos : laserCross
        );
        break;
      }
      case 30: {
        const orbitalR = 150 + seededRandom(i, 0) * 200;
        const orbitalPhi = seededRandom(i, 1) * Math.PI;
        const orbitalTheta = seededRandom(i, 2) * Math.PI * 2;
        const probability = Math.exp(-orbitalR / 200);
        pos.push(
          orbitalR * Math.sin(orbitalPhi) * Math.cos(orbitalTheta) * probability,
          orbitalR * Math.sin(orbitalPhi) * Math.sin(orbitalTheta) * probability,
          orbitalR * Math.cos(orbitalPhi) * probability
        );
        break;
      }
      case 31: {
        const wormholeT = (i / count - 0.5) * 2;
        const wormholeR = 200 * Math.sqrt(1 - wormholeT * wormholeT) + 50;
        const wormholeAngle = i * 0.1;
        pos.push(
          wormholeR * Math.cos(wormholeAngle),
          wormholeT * 500,
          wormholeR * Math.sin(wormholeAngle)
        );
        break;
      }
      case 32: {
        const prismLayer = Math.floor(i / (count / 7));
        const prismAngle = (prismLayer / 7) * Math.PI / 3;
        const prismDist = (i % (count / 7)) * 3;
        const prismSpread = prismDist * Math.tan(prismAngle);
        pos.push(
          prismSpread * Math.cos(seed + i * 0.01),
          prismDist - 500,
          prismSpread * Math.sin(seed + i * 0.01)
        );
        break;
      }
      case 33: {
        const sonicR = 300 + Math.sin(i * 0.02 + seed * 0.01) * 100;
        const sonicFreq = 5 + (seed % 10);
        pos.push(
          sonicR * Math.cos(u) * Math.sin(v),
          sonicR * Math.sin(u) * Math.sin(v) + Math.sin(i * sonicFreq * 0.01) * 50,
          sonicR * Math.cos(v)
        );
        break;
      }
      case 34: {
        const stormAngle = i * 0.1 + seed * 0.001;
        const stormRadius = 100 + (i % 1000) * 0.5;
        const stormHeight = Math.sin(i * 0.05) * 300;
        pos.push(
          stormRadius * Math.cos(stormAngle),
          stormHeight,
          stormRadius * Math.sin(stormAngle)
        );
        break;
      }
      case 35: {
        const byteStream = i % 8;
        const byteX = (byteStream - 4) * 100;
        const byteY = (i - count / 2) * 1.5;
        const byteZ = Math.sin(i * 0.1 + byteStream) * 50;
        pos.push(byteX, byteY, byteZ);
        break;
      }
      case 36: {
        const fieldR = 400;
        const fieldJitter = seededRandom(i) * 100;
        pos.push(
          (fieldR + fieldJitter) * Math.cos(u) * Math.sin(v),
          (fieldR + fieldJitter) * Math.sin(u) * Math.sin(v),
          (fieldR + fieldJitter) * Math.cos(v)
        );
        break;
      }
      case 37: {
        const riftSide = i % 2 === 0 ? 1 : -1;
        const riftDist = (i % (count / 2)) * 2;
        const riftOffset = Math.sin(i * 0.05) * 100;
        pos.push(
          riftDist * Math.cos(seed + i * 0.01) + riftSide * riftOffset,
          riftDist * Math.sin(seed + i * 0.01),
          riftSide * 200
        );
        break;
      }
      case 38: {
        const singR = (count - i) * 0.5;
        const singPhi = Math.acos(-1 + (2 * i) / count);
        const singTheta = Math.sqrt(count * Math.PI) * singPhi;
        pos.push(
          singR * Math.cos(singTheta) * Math.sin(singPhi),
          singR * Math.sin(singTheta) * Math.sin(singPhi),
          singR * Math.cos(singPhi)
        );
        break;
      }
      case 39: {
        const photonSpeed = i * 5;
        const photonAngle = seededRandom(i, 0) * Math.PI * 2;
        const photonElevation = seededRandom(i, 1) * Math.PI - Math.PI / 2;
        pos.push(
          photonSpeed * Math.cos(photonAngle) * Math.cos(photonElevation),
          photonSpeed * Math.sin(photonElevation),
          photonSpeed * Math.sin(photonAngle) * Math.cos(photonElevation)
        );
        break;
      }
      case 40: {
        const petalCount = 8;
        const petal = Math.floor((i / count) * petalCount);
        const petalAngle = (petal / petalCount) * Math.PI * 2;
        const petalR = (i % (count / petalCount)) * 0.5;
        const petalCurve = Math.sin(petalR * 0.1) * 100;
        pos.push(
          (petalR + petalCurve) * Math.cos(petalAngle),
          petalR * 0.5,
          (petalR + petalCurve) * Math.sin(petalAngle)
        );
        break;
      }
      case 41: {
        const voidR = 350;
        const voidShell = voidR + (seededRandom(i) - 0.5) * 50;
        pos.push(
          voidShell * Math.cos(u) * Math.sin(v),
          voidShell * Math.sin(u) * Math.sin(v),
          voidShell * Math.cos(v)
        );
        break;
      }
      case 42: {
        const pulseWave = Math.floor(i / (count / 20));
        const pulseR = pulseWave * 50 + 100;
        const pulseAngle = (i % (count / 20)) * 0.5;
        pos.push(
          pulseR * Math.cos(pulseAngle),
          pulseR * Math.sin(pulseAngle),
          seededRandom(i) * 100 - 50
        );
        break;
      }
      case 43: {
        const mandalaR = (i % 200) * 2;
        const mandalaAngle = i * 0.1 + Math.floor(i / 200) * (Math.PI / 6);
        const mandalaLayer = Math.floor(i / 200);
        pos.push(
          mandalaR * Math.cos(mandalaAngle),
          mandalaLayer * 30 - 300,
          mandalaR * Math.sin(mandalaAngle)
        );
        break;
      }
      case 44: {
        const beamX = (i % 10 - 5) * 50;
        const beamZ = (Math.floor(i / 10) % 10 - 5) * 50;
        const beamY = (i - count / 2) * 2 + Math.sin(i * 0.05) * 30;
        pos.push(beamX, beamY, beamZ);
        break;
      }
      case 45: {
        const spireHeight = i * 2;
        const spireR = 150 - spireHeight * 0.1;
        const spireAngle = i * 0.05;
        const spireFacet = Math.floor(i * 0.1) % 6;
        pos.push(
          spireR * Math.cos(spireFacet * Math.PI / 3) + Math.cos(spireAngle) * 30,
          spireHeight - count,
          spireR * Math.sin(spireFacet * Math.PI / 3) + Math.sin(spireAngle) * 30
        );
        break;
      }
      case 46: {
        const gravR = 100 + i * 0.5;
        const gravPhi = Math.acos(-1 + (2 * i) / count);
        const gravTheta = Math.sqrt(count * Math.PI) * gravPhi;
        const gravCurve = 1 / (1 + gravR / 300);
        pos.push(
          gravR * Math.cos(gravTheta) * Math.sin(gravPhi) * gravCurve,
          gravR * Math.sin(gravTheta) * Math.sin(gravPhi) * gravCurve,
          gravR * Math.cos(gravPhi)
        );
        break;
      }
      case 47: {
        const stormCell = Math.floor(seededRandom(i, 0) * 10);
        const cellX = (stormCell % 3 - 1) * 300;
        const cellZ = (Math.floor(stormCell / 3) - 1) * 300;
        const boltY = seededRandom(i, 1) * 600 - 300;
        const boltOffset = seededRandom(i, 2) * 100;
        pos.push(cellX + boltOffset, boltY, cellZ + boltOffset);
        break;
      }
      case 48: {
        const gateW = (i / count - 0.5) * 4;
        const gateR = 250 + Math.abs(gateW) * 50;
        const gateAngle = i * 0.05;
        pos.push(
          gateR * Math.cos(gateAngle),
          gateW * 200,
          gateR * Math.sin(gateAngle)
        );
        break;
      }
      case 49: {
        const holoLayer = Math.floor(i / (count / 10));
        const holoR = 200 + holoLayer * 30;
        const holoAngle = (i % (count / 10)) * 0.2;
        const holoFlicker = seededRandom(i) * 20;
        pos.push(
          (holoR + holoFlicker) * Math.cos(holoAngle),
          holoLayer * 50 - 250,
          (holoR + holoFlicker) * Math.sin(holoAngle)
        );
        break;
      }
      case 50: {
        const fluxX = (i % 50) * 40 - 1000;
        const fluxZ = Math.floor(i / 50) * 40 - 400;
        const fluxY = Math.sin(fluxX * 0.05 + seed * 0.001) * 100 + Math.cos(fluxZ * 0.05) * 100;
        pos.push(fluxX, fluxY, fluxZ);
        break;
      }
      case 51: {
        const burstAngle = seededRandom(i, 0) * Math.PI * 2;
        const burstPhi = seededRandom(i, 1) * Math.PI;
        const burstSpeed = i * 3 + seededRandom(i, 2) * 100;
        pos.push(
          burstSpeed * Math.sin(burstPhi) * Math.cos(burstAngle),
          burstSpeed * Math.sin(burstPhi) * Math.sin(burstAngle),
          burstSpeed * Math.cos(burstPhi)
        );
        break;
      }
      case 52: {
        const codeHeight = i * 0.15 - 750;
        const codeR = 180 + Math.sin(i * 0.02) * 50;
        const codeBit = (i % 8);
        const codeAngle = (codeBit / 8) * Math.PI * 2 + i * 0.01;
        pos.push(
          codeR * Math.cos(codeAngle),
          codeHeight,
          codeR * Math.sin(codeAngle)
        );
        break;
      }
      case 53: {
        const voidRingR = 350 + Math.sin(i * 0.05) * 30;
        const voidRingAngle = (i / count) * Math.PI * 2;
        pos.push(
          voidRingR * Math.cos(voidRingAngle),
          Math.sin(voidRingAngle * 3) * 50,
          voidRingR * Math.sin(voidRingAngle)
        );
        break;
      }
      case 54: {
        const cubeSize = 300;
        const pulseCubeX = ((i % 20) / 20 - 0.5) * cubeSize;
        const pulseCubeY = ((Math.floor(i / 20) % 20) / 20 - 0.5) * cubeSize;
        const pulseCubeZ = ((Math.floor(i / 400) % 20) / 20 - 0.5) * cubeSize;
        const pulseFactor = 1 + Math.sin(i * 0.05 + seed * 0.01) * 0.2;
        pos.push(pulseCubeX * pulseFactor, pulseCubeY * pulseFactor, pulseCubeZ * pulseFactor);
        break;
      }
      case 55: {
        const warpR = 250 + seededRandom(i, 0) * 150;
        const warpPhi = Math.acos(-1 + (2 * i) / count);
        const warpTheta = Math.sqrt(count * Math.PI) * warpPhi;
        const warpDist = 1 + Math.sin(warpPhi * 3) * 0.3;
        pos.push(
          warpR * Math.cos(warpTheta) * Math.sin(warpPhi) * warpDist,
          warpR * Math.sin(warpTheta) * Math.sin(warpPhi) * warpDist,
          warpR * Math.cos(warpPhi)
        );
        break;
      }
      case 56: {
        const webNodes = 20;
        const node1 = Math.floor(seededRandom(i, 0) * webNodes);
        const node2 = Math.floor(seededRandom(i, 1) * webNodes);
        const webT = (i % 100) / 100;
        const webAngle1 = (node1 / webNodes) * Math.PI * 2;
        const webAngle2 = (node2 / webNodes) * Math.PI * 2;
        const webR = 400;
        pos.push(
          webR * Math.cos(webAngle1) * (1 - webT) + webR * Math.cos(webAngle2) * webT,
          seededRandom(i, 2) * 200 - 100,
          webR * Math.sin(webAngle1) * (1 - webT) + webR * Math.sin(webAngle2) * webT
        );
        break;
      }
      case 57: {
        const tubeSegment = Math.floor(i / (count / 10));
        const tubeAngle = (i % (count / 10)) * 0.1;
        const tubeR = 150 + Math.sin(tubeAngle * 2) * 50;
        const tubeX = tubeSegment * 100 - 500;
        pos.push(
          tubeX,
          tubeR * Math.cos(tubeAngle),
          tubeR * Math.sin(tubeAngle)
        );
        break;
      }
      case 58: {
        const cyberAngle = i * 0.08 + seed * 0.001;
        const cyberR = 200 + (i % 800) * 0.3;
        const cyberHeight = Math.sin(i * 0.03) * 400;
        const cyberJitter = seededRandom(i) * 50;
        pos.push(
          cyberR * Math.cos(cyberAngle) + cyberJitter,
          cyberHeight,
          cyberR * Math.sin(cyberAngle) + cyberJitter
        );
        break;
      }
      case 59: {
        const nucleus = i < count / 10;
        const atomR = nucleus ? 50 : 200 + seededRandom(i, 0) * 100;
        const atomPhi = seededRandom(i, 1) * Math.PI;
        const atomTheta = seededRandom(i, 2) * Math.PI * 2;
        pos.push(
          atomR * Math.sin(atomPhi) * Math.cos(atomTheta),
          atomR * Math.sin(atomPhi) * Math.sin(atomTheta),
          atomR * Math.cos(atomPhi)
        );
        break;
      }
      case 60: {
        const lightDepth = i * 2 - count;
        const lightR = 100 + Math.abs(lightDepth) * 0.1 + Math.sin(i * 0.1) * 50;
        const lightAngle = i * 0.05;
        pos.push(
          lightR * Math.cos(lightAngle),
          lightDepth,
          lightR * Math.sin(lightAngle)
        );
        break;
      }
      case 61: {
        const fractalLevel = Math.floor(i / (count / 5));
        const fractalScale = Math.pow(0.5, fractalLevel);
        const fractalAngle = (i % (count / 5)) * 0.2;
        const fractalR = 500 * fractalScale;
        pos.push(
          fractalR * Math.cos(fractalAngle) + fractalLevel * 100,
          fractalR * Math.sin(fractalAngle),
          fractalLevel * 100 - 200
        );
        break;
      }
      case 62: {
        const sonicRingR = 300 + Math.sin(i * 0.1 + seed * 0.01) * 80;
        const sonicRingAngle = (i / count) * Math.PI * 2;
        const sonicRingWave = Math.sin(sonicRingAngle * 8) * 50;
        pos.push(
          sonicRingR * Math.cos(sonicRingAngle),
          sonicRingWave,
          sonicRingR * Math.sin(sonicRingAngle)
        );
        break;
      }
      case 63: {
        const dataAngle = i * 0.15 + seed * 0.001;
        const dataR = Math.sqrt(i * 20);
        const dataHeight = i * 1.5 - count * 0.75;
        pos.push(
          dataR * Math.cos(dataAngle),
          dataHeight,
          dataR * Math.sin(dataAngle)
        );
        break;
      }
      case 64: {
        const neonR = 250 + Math.sin(i * 0.05 + seed * 0.01) * 100;
        const neonPhi = Math.acos(-1 + (2 * i) / count);
        const neonTheta = Math.sqrt(count * Math.PI) * neonPhi;
        const neonPulse = 1 + Math.sin(i * 0.1) * 0.2;
        pos.push(
          neonR * Math.cos(neonTheta) * Math.sin(neonPhi) * neonPulse,
          neonR * Math.sin(neonTheta) * Math.sin(neonPhi) * neonPulse,
          neonR * Math.cos(neonPhi) * neonPulse
        );
        break;
      }
      case 65: {
        const quantumX = (i % 40) * 30 - 600;
        const quantumZ = Math.floor(i / 40) * 30 - 600;
        const quantumY = Math.sin(quantumX * 0.05 + quantumZ * 0.05 + seed * 0.001) * 200;
        const quantumUncertainty = seededRandom(i) * 50;
        pos.push(quantumX + quantumUncertainty, quantumY, quantumZ + quantumUncertainty);
        break;
      }
      case 66: {
        const gateH = (i / count - 0.5) * 800;
        const gateR = 300 - Math.abs(gateH) * 0.3;
        const gateAngle = i * 0.03;
        const gateSpiral = Math.sin(i * 0.1) * 50;
        pos.push(
          (gateR + gateSpiral) * Math.cos(gateAngle),
          gateH,
          (gateR + gateSpiral) * Math.sin(gateAngle)
        );
        break;
      }
    }
  }

  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  return geo;
}

export function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

export function getColorFromSeed(seed: number): THREE.Color {
  const hue = (seed % 360) / 360;
  return new THREE.Color().setHSL(hue, 0.8, 0.5);
}
