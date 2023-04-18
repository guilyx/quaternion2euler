// Constants for converting between degrees and radians
const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;
const PRECISION = 4

// Function to convert quaternion to euler angles
function quaternionToEuler(x, y, z, w, units) {
    const ysqr = y * y;

    // Roll (x-axis rotation)
    const t0 = 2.0 * (w * x + y * z);
    const t1 = 1.0 - 2.0 * (x * x + ysqr);
    var roll = Math.atan2(t0, t1);

    // Pitch (y-axis rotation)
    let t2 = 2.0 * (w * y - z * x);
    t2 = t2 > 1.0 ? 1.0 : t2;
    t2 = t2 < -1.0 ? -1.0 : t2;
    var pitch = Math.asin(t2);

    // Yaw (z-axis rotation)
    const t3 = 2.0 * (w * z + x * y);
    const t4 = 1.0 - 2.0 * (ysqr + z * z);
    var yaw = Math.atan2(t3, t4);

    if (units === "degrees") {
        roll = roll * RAD_TO_DEG;
        pitch = pitch * RAD_TO_DEG;
        yaw = yaw * RAD_TO_DEG;
    }

    return [roll, pitch, yaw];
}

// Function to convert euler angles to quaternion
function eulerToQuaternion(roll, pitch, yaw, units) {
    // Convert angles to radians if units are degrees
    if (units === "degrees") {
        roll = roll * DEG_TO_RAD;
        pitch = pitch * DEG_TO_RAD;
        yaw = yaw * DEG_TO_RAD;
    }

    const cy = Math.cos(yaw * 0.5);
    const sy = Math.sin(yaw * 0.5);
    const cp = Math.cos(pitch * 0.5);
    const sp = Math.sin(pitch * 0.5);
    const cr = Math.cos(roll * 0.5);
    const sr = Math.sin(roll * 0.5);

    const w = cy * cp * cr + sy * sp * sr;
    const x = cy * cp * sr - sy * sp * cr;
    const y = sy * cp * sr + cy * sp * cr;
    const z = sy * cp * cr - cy * sp * sr;

    return [x, y, z, w];
}

function updateResultFromButton() {
    const idPrefix = this.id === "quaternionConvertButton" ? "quaternion" : "euler";

    if (idPrefix === "quaternion") {
        updateResult(true, true);
    } else if (idPrefix === "euler") {
        updateResult(false, true);
    }
}

// Function to update the result based on the current mode
function updateResult(to_euler, store_in_history) {
    if (to_euler === true) {
        const x = parseFloat(document.getElementById("x").value);
        const y = parseFloat(document.getElementById("y").value);
        const z = parseFloat(document.getElementById("z").value);
        const w = parseFloat(document.getElementById("w").value);

        const units = document.querySelector('input[name="units"]:checked').value
        const [roll, pitch, yaw] = quaternionToEuler(x, y, z, w, units);

        document.getElementById("roll").value = roll.toFixed(PRECISION);
        document.getElementById("pitch").value = pitch.toFixed(PRECISION);
        document.getElementById("yaw").value =  yaw.toFixed(PRECISION);
        document.getElementById("pitchSlider").value = pitch.toFixed(PRECISION);
        document.getElementById("yawSlider").value = yaw.toFixed(PRECISION);
        document.getElementById("rollSlider").value = roll.toFixed(PRECISION);
        
        // Update history
        if (store_in_history == true) {
            const input = `${x.toFixed(PRECISION)}, ${y.toFixed(PRECISION)}, ${z.toFixed(PRECISION)}, ${w.toFixed(PRECISION)}`;
            const result = `${roll.toFixed(PRECISION)}, ${pitch.toFixed(PRECISION)}, ${yaw.toFixed(PRECISION)}`;
            updateHistory(input, result);
        }
    } else if (to_euler === false) {
        const roll = parseFloat(document.getElementById("roll").value);
        const pitch = parseFloat(document.getElementById("pitch").value);
        const yaw = parseFloat(document.getElementById("yaw").value);
        const units = document.querySelector('input[name="units"]:checked').value
        const [x, y, z, w] = eulerToQuaternion(roll, pitch, yaw, units);

        document.getElementById("x").value = x.toFixed(PRECISION);
        document.getElementById("y").value = y.toFixed(PRECISION);
        document.getElementById("z").value = z.toFixed(PRECISION);
        document.getElementById("w").value = w.toFixed(PRECISION);
        document.getElementById("xSlider").value = x.toFixed(PRECISION);
        document.getElementById("wSlider").value = w.toFixed(PRECISION);
        document.getElementById("ySlider").value = y.toFixed(PRECISION);
        document.getElementById("zSlider").value = w.toFixed(PRECISION);

        // Update history
        if (store_in_history == true) {
            const input = `${x.toFixed(PRECISION)}, ${y.toFixed(PRECISION)}, ${z.toFixed(PRECISION)}, ${w.toFixed(PRECISION)}`;
            const result = `${roll.toFixed(PRECISION)}, ${pitch.toFixed(PRECISION)}, ${yaw.toFixed(PRECISION)}`;
            updateHistory(input, result);
        }
    }
}

// Function to update the history
function updateHistory(input, result) {
    const historyList = document.getElementById("historyList");

    // Create a new list item with the input and result
    const newItem = document.createElement("li");
    const itemText = document.createTextNode(`${input} = ${result}`);
    newItem.appendChild(itemText);

    // Add the new item to the top of the history list
    historyList.insertBefore(newItem, historyList.firstChild);
}

// Attach event listeners to the convert button and units radio buttons
document.getElementById("quaternionConvertButton").addEventListener("click", updateResultFromButton);
document.getElementById("eulerConvertButton").addEventListener("click", updateResultFromButton);
document.getElementById("resetToZero").addEventListener("click", function() {
    document.getElementById("xSlider").value = 0.0;
    document.getElementById("wSlider").value = 1.0;
    document.getElementById("ySlider").value = 0.0;
    document.getElementById("zSlider").value = 0.0;
    document.getElementById("pitchSlider").value = 0.0;
    document.getElementById("yawSlideupdateResultr").value = 0.0;
    document.getElementById("rollSlider").value = 0.0;
    document.getElementById("w").value = 1.0;
    document.getElementById("x").value = 0.0;
    document.getElementById("y").value = 0.0;
    document.getElementById("z").value = 0.0;
    document.getElementById("roll").value = 0.0;
    document.getElementById("pitch").value = 0.0;
    document.getElementById("yaw").value = 0.0;
});

document.getElementById("x").addEventListener("input", function() {
  document.getElementById("xSlider").value = document.getElementById("x").value;
  updateResult(true, false);
});
document.getElementById("w").addEventListener("input", function() {
  document.getElementById("wSlider").value = document.getElementById("w").value;
  updateResult(true, false);
});
document.getElementById("y").addEventListener("input", function() {
  document.getElementById("ySlider").value = document.getElementById("y").value;
  updateResult(true, false);
});
document.getElementById("z").addEventListener("input", function() {
  document.getElementById("zSlider").value = document.getElementById("z").value;
  updateResult(true, false);
});
document.getElementById("roll").addEventListener("input", function() {
  document.getElementById("rollSlider").value = document.getElementById("roll").value;
  updateResult(false, false);
});
document.getElementById("pitch").addEventListener("input", function() {
  document.getElementById("pitchSlider").value = document.getElementById("pitch").value;
  updateResult(false, false);
});
document.getElementById("yaw").addEventListener("input", function() {
  document.getElementById("yawSlider").value = document.getElementById("yaw").value;
  updateResult(false, false);
});
document.getElementById("wSlider").addEventListener("input", function() {
    document.getElementById("w").value = this.value;
    updateResult(true, false);
});
document.getElementById("xSlider").addEventListener("input", function() {
    document.getElementById("x").value = this.value;
    updateResult(true, false);
});
document.getElementById("ySlider").addEventListener("input", function() {
    document.getElementById("y").value = this.value;
    updateResult(true, false);
});
document.getElementById("zSlider").addEventListener("input", function() {
    document.getElementById("z").value = this.value;
    updateResult(true, false);
});
document.getElementById("rollSlider").addEventListener("input", function() {
    document.getElementById("roll").value = this.value;
    updateResult(false, false);
});
document.getElementById("pitchSlider").addEventListener("input", function() {
    document.getElementById("pitch").value = this.value;
    updateResult(false, false);
});
document.getElementById("yawSlider").addEventListener("input", function() {
    document.getElementById("yaw").value = this.value;
    updateResult(false, false);
});

document.getElementById("copyYawButton").addEventListener("click", function() {
    const res = document.getElementById("yaw").value;
    navigator.clipboard.writeText(res);
    alert("Copied Yaw Value: " + res);
});

document.getElementById("copyRollButton").addEventListener("click", function() {
    const res = document.getElementById("roll").value;
    navigator.clipboard.writeText(res);
    alert("Copied Roll Value: " + res);
});

document.getElementById("copyPitchButton").addEventListener("click", function() {
    const res = document.getElementById("pitch").value;
    navigator.clipboard.writeText(res);
    alert("Copied Pitch Value: " + res);
});

document.getElementById("copyXButton").addEventListener("click", function() {
    const res = document.getElementById("x").value;
    navigator.clipboard.writeText(res);
    alert("Copied X Value: " + res);
});

document.getElementById("copyYButton").addEventListener("click", function() {
    const res = document.getElementById("y").value;
    navigator.clipboard.writeText(res);
    alert("Copied Y Value: " + res);
});

document.getElementById("copyZButton").addEventListener("click", function() {
    const res = document.getElementById("z").value;
    navigator.clipboard.writeText(res);
    alert("Copied Z Value: " + res);
});

document.getElementById("copyWButton").addEventListener("click", function() {
    const res = document.getElementById("w").value;
    navigator.clipboard.writeText(res);
    alert("Copied W Value: " + res);
});