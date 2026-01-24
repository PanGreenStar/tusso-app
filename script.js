/* ===== CẤU HÌNH ===== */
const PRICE = {
    bida: 30000,
    volleyball: 70000,
    game: 20000,
    football5: 150000,
    football7: 300000
};

let revenueByArea = {
    bida: 0,
    volleyball: 0,
    game: 0,
    football: 0
};


let revenueData = {
    bida: [],
    bongchuyen: [],
    bongda: [],
    maygame: []
};


let reportByArea = {
    game: [],
    volleyball: [],
    football: [],
    bida: []
};



const menuList = [
    { name:"Sting", price:10000 },
    { name:"Number1 vàng", price:10000 },
    { name:"Nước Lọc", price:5000 },
    { name:"Pepsi", price:10000 },
    { name:"7 up", price:10000 },
    { name:"Revive", price:10000 },
    { name:"Ô long", price:10000 },
    { name:"Soya đậu nành", price:10000 },
    { name:"Mì 3 miền", price:5000 },
    { name:"Mì Indomie", price:10000 },
    { name:"1 Viên bò", price:5000 },
    { name:"2 Xúc xích nhỏ", price:5000 },
    { name:"Xúc xích lớn", price:10000 },
    { name:"Trứng xúc xích", price:10000 },
    { name:"N", price:17000 },
    { name:"SB", price:17000 },
    { name:"SM", price:22000 },
    { name:"Z", price:25000 }
];

let dailyRevenue = 0;
let menuSoldToday = {};
const PASSWORD = "0201"; // đổi mật khẩu ở đây

function saveTableState(tableId, data) {
    localStorage.setItem("table_" + tableId, JSON.stringify(data));
}

function loadTableState(tableId) {
    const data = localStorage.getItem("table_" + tableId);
    return data ? JSON.parse(data) : null;
}

function clearTableState(tableId) {
    localStorage.removeItem("table_" + tableId);
}


function unlock() {
    const input = document.getElementById("passwordInput").value;
    const error = document.getElementById("errorText");

    if (input === PASSWORD) {
        document.getElementById("lockScreen").style.display = "none";
        document.getElementById("appContent").style.display = "block";
        error.innerText = "";
    } else {
        error.innerText = "Sai mật khẩu!";
    }
}


function formatMoneyInput(value) {
    value = value.replace(/\./g, '');
    if (isNaN(value)) return '';
    return Number(value).toLocaleString('vi-VN');
}


/* ===== HÀM CHUNG ===== */

function getMenuPrice(name) {
    const item = menuList.find(i => i.name === name);
    return item ? item.price : 0;
}



function money(n){ return n.toLocaleString("vi-VN")+" đ"; }
function time(t){ return t.toLocaleTimeString("vi-VN",{hour:"2-digit",minute:"2-digit"}); }
function updateDaily(){ document.getElementById("dailyTotal").innerText = money(dailyRevenue); }

function showRevenue(areaKey){
    alert(
        `📊 Doanh thu hôm nay\n\n` +
        `${areaKey.toUpperCase()}: ${money(revenueByArea[areaKey])}`
    );
}

function saveReport(areaKey, data) {
    const today = new Date().toLocaleDateString("vi-VN");

    if (!reportByArea[areaKey]) {
        reportByArea[areaKey] = [];
    }

    let day = reportByArea[areaKey].find(d => d.date === today);
    if (!day) {
        day = { date: today, records: [] };
        reportByArea[areaKey].push(day);
    }

    day.records.push(data);

    console.log("✅ LƯU DOANH THU:", areaKey, data);
}




/* ===== TẠO BÀN ===== */



function renderMenu(menuDiv, menuCount, menuTotalRef, onChange) {

    menuDiv.innerHTML = "";

    menuList.forEach(item => {

        if (menuCount[item.name] === undefined) {
    menuCount[item.name] = 0;
}

        const row = document.createElement("div");
        row.className = "menu-item";

        row.innerHTML = `
            <span class="menu-name">${item.name} (${money(item.price)})</span>
            <div>
                <button>-</button>
                <span class="menu-qty">${menuCount[item.name]}</span>
                 

                <button>+</button>
            </div>
        `;

        const qty = row.querySelector(".menu-qty");
        const btnMinus = row.querySelectorAll("button")[0];
        const btnPlus  = row.querySelectorAll("button")[1];

        if (menuCount[item.name] === 0) {
    btnMinus.disabled = true;
}


        btnMinus.onclick = () => {
    if (menuCount[item.name] > 0) {
        menuCount[item.name]--;
        qty.innerText = menuCount[item.name];

        menuTotalRef.value -= item.price;  // ✅
        if (onChange) onChange();

        saveApp();

        if (menuCount[item.name] === 0) btnMinus.disabled = true;
    }
};




       btnPlus.onclick = () => {
    menuCount[item.name]++;
    qty.innerText = menuCount[item.name];
    btnMinus.disabled = false;

    menuTotalRef.value += item.price;   // ✅
    if (onChange) onChange();

    saveApp();

};



        menuDiv.appendChild(row);
    });
}

document.addEventListener("input", function (e) {
    if (!e.target.classList.contains("prepaid")) return;

    let raw = e.target.value.replace(/\./g, '');
    e.target.dataset.value = raw;
    e.target.value = formatMoneyInput(e.target.value);
});


function createArea(areaId, title, count, price, areaKey){
    const area = document.getElementById(areaId);



    for(let i=1;i<=count;i++){
        const card = document.createElement("div");
        card.className="card";
        const machineName = `${title} ${i}`;
        const tableId = `${areaKey}_${i}`;

        card.innerHTML = `
    <h3>${title} ${i}</h3>

    <div class="table-total">
    <div>⏱ Tiền giờ: <span class="time-money">0 đ</span></div>
    <div>🍔 Tiền menu: <span class="menu-money">0 đ</span></div>
    <div style="font-weight:700">
        👉 Tổng: <span class="table-money">0 đ</span>
    </div>
</div>



    <button class="mode-after">Trả sau</button>
    <button class="mode-before">Trả trước</button>

    <input class="prepaid" type="text" placeholder="Tiền trả trước">


    <div class="control" style="display:none">
        <button class="start">▶ Bắt đầu</button>
        <button class="end">■ Kết thúc</button>
    </div>

    <div class="menu-toggle">☰ Menu</div>
    <div class="menu"></div>

    <div class="info"></div>
`;

        area.appendChild(card);



        function resetSession() {
    if (timer) {
        clearInterval(timer);
        timer = null;
    }

    // reset logic
    isPlaying = false;
    startTime = null;
    endTime = null;
    mode = null;

    card.classList.remove("playing");

    // reset tiền
    menuTotalRef.value = 0;
    card.querySelector(".time-money").innerText = "0 đ";
    card.querySelector(".menu-money").innerText = "0 đ";
    card.querySelector(".table-money").innerText = "0 đ";

    // reset menu
    menuCount = {};
    renderMenu(menuDiv, menuCount, menuTotalRef, updateTableMoneyRealtime);

    // reset trả trước
    prepaidInput.value = "";
    prepaidInput.dataset.value = "";
    prepaidInput.style.display = "none";

    // reset menu UI
    menuDiv.classList.remove("show");
    card.querySelector(".menu-toggle").innerText = "☰ Menu";

    // reset nút chế độ
    btnAfter.classList.remove("active");
    btnBefore.classList.remove("active");

    // reset control
    control.style.display = "none";
    info.innerHTML = "Chưa bắt đầu";

    // xóa lưu bàn
    clearTableState(tableId);
}





        let mode = null;
        let startTime = null;
        let endTime = null; 
        let menuCount = {};
        let timer = null;
        let isPlaying = false;

        function updateTableMoneyRealtime() {
    let timeMoney = 0;

    if (isPlaying && startTime) {
        const now = new Date();
        const minutes = Math.max(
            1,
            Math.ceil((now - startTime) / 60000)
        );
        timeMoney = Math.ceil(minutes / 60 * price);
    }

    const total = timeMoney + menuTotalRef.value;

    card.querySelector(".time-money").innerText = money(timeMoney);
    card.querySelector(".menu-money").innerText = money(menuTotalRef.value);
    card.querySelector(".table-money").innerText = money(total);

    saveTableState(tableId, {
    mode,
    startTime: startTime ? startTime.getTime() : null,
    endTime: endTime ? endTime.getTime() : null,
    menuCount,
    menuTotal: menuTotalRef.value,
    prepaid: prepaidInput.dataset.value || 0,
    isPlaying
});

}



        const prepaidInput = card.querySelector(".prepaid");
        prepaidInput.style.display = "none";

        const control = card.querySelector(".control");
        const info = card.querySelector(".info");
        const menuDiv = card.querySelector(".menu");
        const btnAfter = card.querySelector(".mode-after");
        const btnBefore = card.querySelector(".mode-before");


        /* MENU */
        let menuTotalRef = { value: 0 };

        

renderMenu(menuDiv, menuCount, menuTotalRef, updateTableMoneyRealtime)
const saved = loadTableState(tableId);

if (saved && saved.isPlaying) {
    mode = saved.mode;
    startTime = new Date(saved.startTime);
    endTime = saved.endTime ? new Date(saved.endTime) : null;

    menuCount = saved.menuCount || {};
    menuTotalRef.value = saved.menuTotal || 0;

    prepaidInput.dataset.value = saved.prepaid || 0;
    prepaidInput.value = formatMoneyInput(saved.prepaid || "");

    renderMenu(menuDiv, menuCount, menuTotalRef, updateTableMoneyRealtime);

    isPlaying = true;
    card.classList.add("playing");
    control.style.display = "block";

    // ⭐⭐ THÊM DÒNG NÀY ⭐⭐
    setTimeout(() => {
    updateTableMoneyRealtime();
}, 0);

if (timer) {
        clearInterval(timer);
        timer = null;
    }

    timer = setInterval(() => {
        updateTableMoneyRealtime();
    }, 1000);
}





      const toggle = card.querySelector(".menu-toggle");

toggle.onclick = () => {
    if (!startTime) {
    alert("Bấm Bắt đầu trước khi gọi món");
    return;
}

    menuDiv.classList.toggle("show");
    toggle.innerText = menuDiv.classList.contains("show")
        ? "✕ Đóng menu"
        : "☰ Menu";
};



        card.querySelector(".mode-after").onclick=()=>{
            mode="after";
            prepaidInput.style.display="none";
             control.style.display = "block"; 
        };

        card.querySelector(".mode-before").onclick=()=>{
            mode="before";
            prepaidInput.style.display="block";
             control.style.display = "block"; 
        };

    


        card.querySelector(".start").onclick = () => {

    if (isPlaying) return;

    if (!mode) {
        alert("Chọn Trả trước hoặc Trả sau");
        return;
    }

    if (mode === "before" && !prepaidInput.value) {
        alert("Nhập tiền trả trước");
        return;
    }

    isPlaying = true;
    startTime = new Date();
    card.classList.add("playing");

    updateTableMoneyRealtime();

    if (mode === "before") {
        const prepaid = Number(prepaidInput.dataset.value || 0)

        const seconds = prepaid / price * 3600;
        endTime = new Date(startTime.getTime() + seconds * 1000);
    }

    if (timer) {
    clearInterval(timer);
    timer = null;
}
   
    timer = setInterval(() => {
        const now = new Date();
        let html = `Giờ bắt đầu: ${time(startTime)}<br>`;

        if (mode === "before") {

            // ✅ HẾT GIỜ → AUTO KẾT THÚC
            if (now >= endTime) {


                clearInterval(timer);
                timer = null;

                const prepaid = Number(prepaidInput.dataset.value || 0)

                const menuMoney = menuTotalRef.value;

                // ✔️ Nếu khách hết giờ, tiền menu vẫn tính thêm
                dailyRevenue += prepaid + menuMoney;
                revenueByArea[areaKey] += prepaid + menuMoney;
                updateDaily();
                saveApp();

                const minutes = Math.ceil((endTime - startTime) / 60000);
                const moneyTime = Number(prepaidInput.dataset.value || 0)


                const hours = Math.floor(minutes / 60);
                const mins  = minutes % 60;

               


            
let reportKey =
    areaKey === "bida" ? "bida" :
    areaKey === "game" ? "game" :
    areaKey.includes("football") ? "football" :
    "volleyball";

    for (let item in menuCount) {
    if (menuCount[item] > 0) {
        if (!menuSoldToday[item]) menuSoldToday[item] = 0;
        menuSoldToday[item] += menuCount[item];
        

    }
}

updateTableMoneyRealtime();
saveReport(reportKey, {
    machine: `${title} ${i}`,
    durationText: `${hours} tiếng ${mins} phút`,
    timeMoney: moneyTime,
    menuMoney: menuMoney,
    menuDetail: {...menuCount}
});


                alert(
                    `${title} ${i}\n\n` +
                    `⏰ HẾT GIỜ (TRẢ TRƯỚC)\n\n` +
                    `Tiền giờ: ${money(prepaid)}\n` +
                    `Tiền menu: ${money(menuMoney)}`
                );

                resetSession();
                return;
            }
            const remainSec = Math.ceil((endTime - now) / 1000);
            const remainMin = Math.max(0, Math.ceil(remainSec / 60));
            html += `Giờ kết thúc: ${time(endTime)}<br>`;
            html += `Còn lại: ${remainMin} phút<br>`;
        }

        html += `Tiền menu: ${money(menuTotalRef.value)}`;
        info.innerHTML = html;
        
       saveTableDebounced(tableId, {

    mode,
    startTime: startTime.getTime(),
    endTime: endTime ? endTime.getTime() : null,
    menuCount,
    menuTotal: menuTotalRef.value,
    prepaid: prepaidInput.dataset.value || 0,
    isPlaying: true
});


    }, 1000);
};

setTimeout(updateTableMoneyRealtime, 0);


        card.querySelector(".end").onclick = () => {

    if (!isPlaying || !startTime) {
        alert("⚠️ Phải bấm BẮT ĐẦU trước");
        return;
    }

    clearInterval(timer);
    timer = null;

    const realEndTime = new Date();
    const minutes = Math.ceil((realEndTime - startTime) / 60000);
    const moneyTime = Math.ceil(minutes / 60 * price);
    const menuMoney = menuTotalRef.value;
    const totalMoney = moneyTime + menuMoney;


    let extraPay = 0;
    let refund = 0;

    if (mode === "before") {
        const prepaid = Number(prepaidInput.dataset.value || 0)

        const diff = prepaid - moneyTime - menuMoney;

        if (diff >= 0) {
            refund = diff;       // ✔️ còn dư → trả lại
        } else {
            extraPay = -diff;    // ✔️ thiếu → thu thêm
        }
    }


    saveTableDebounced(tableId, {

    isPlaying: false
});



    dailyRevenue += moneyTime + menuMoney;
   const revenueKey = areaKey.includes("football") ? "football" : areaKey;

   revenueByArea[revenueKey] += moneyTime + menuMoney;

    updateDaily();

    let menuDetail = "Chi tiết menu:\n";
    let hasMenu = false;

for (let item in menuCount) {
    const qty = menuCount[item];
    if (qty > 0) {
        const price = getMenuPrice(item);
        const total = qty * price;
        menuDetail += `${item} x ${qty} : ${money(total)}\n`;
        hasMenu = true;
    }
}

if (!hasMenu) menuDetail = "Không gọi thêm";


    alert(
    `${title} ${i}\n\n` +
    `Giờ bắt đầu: ${time(startTime)}\n` +
    `Giờ kết thúc: ${time(realEndTime)}\n` +
    `Thời gian: ${minutes} phút\n` +
    `Tiền giờ: ${money(moneyTime)}\n` +
    `Tiền menu: ${money(menuMoney)}\n` +
    `------------------\n` +
    `TỔNG TIỀN: ${money(totalMoney)}\n\n` +
    `${menuDetail}` +
    (refund > 0 ? `\n\nTrả lại khách: ${money(refund)}` : "") +
    (extraPay > 0 ? `\n\nKhách trả thêm: ${money(extraPay)}` : "")
);


const hours = Math.floor(minutes / 60);
const mins  = minutes % 60;

let reportKey =
    areaKey === "bida" ? "bida" :
    areaKey === "game" ? "game" :
    areaKey.includes("football") ? "football" :
    "volleyball";

for (let item in menuCount) {
    if (menuCount[item] > 0) {
        if (!menuSoldToday[item]) menuSoldToday[item] = 0;
        menuSoldToday[item] += menuCount[item];
    }
}


saveReport(reportKey, {
    machine: `${title} ${i}`,
    durationText: `${hours} tiếng ${mins} phút`,
    timeMoney: moneyTime,
    menuMoney: menuMoney,
    menuDetail: { ...menuCount }
});

    saveApp();

    resetSession();
};


    }
}
           

createArea("bidaArea", "Bida", 14, PRICE.bida, "bida");
createArea("volleyballArea", "Bóng chuyền", 1, PRICE.volleyball, "volleyball");
createArea("gameArea", "Máy game", 3, PRICE.game, "game");
createArea("football5Area", "Sân 5 người", 2, PRICE.football5, "football5");
createArea("football7Area", "Sân 7 người", 1, PRICE.football7, "football7");

function showDetailedRevenue(areaKey, title) {
    if (!reportByArea[areaKey] || reportByArea[areaKey].length === 0) {
        alert("Chưa có doanh thu");
        return;
    }

    document.getElementById("modalTitle").innerText = title;

    let html = `
    <table>
        <tr>
            <th>Khu</th>
            <th>Thời gian</th>
            <th>Tiền giờ</th>
            <th>Tiền menu</th>
        </tr>
    `;

    reportByArea[areaKey].forEach(day => {
        day.records.forEach(r => {
            html += `
            <tr>
                <td>${r.machine}</td>
                <td>${r.durationText}</td>
                <td>${money(r.timeMoney)}</td>
                <td>${money(r.menuMoney)}</td>
            </tr>
            `;
        });
    });

    html += "</table>";

    document.getElementById("modalContent").innerHTML = html;
    document.getElementById("revenueModal").style.display = "flex";
}

function closeRevenue() {
    document.getElementById("revenueModal").style.display = "none";
}

function saveApp() {
    localStorage.setItem("dailyRevenue", dailyRevenue);
    localStorage.setItem("reportByArea", JSON.stringify(reportByArea));
    localStorage.setItem("menuSoldToday", JSON.stringify(menuSoldToday)); // ✅ THÊM
}


window.onload = () => {
    dailyRevenue = Number(localStorage.getItem("dailyRevenue") || 0);
    reportByArea = JSON.parse(localStorage.getItem("reportByArea")) || {
        game: [],
        volleyball: [],
        football: [],
        bida: []
    };
    menuSoldToday = JSON.parse(localStorage.getItem("menuSoldToday")) || {}; // ✅ THÊM
    updateDaily();
};





function showTodayRevenue() {
    let timeTotal = 0;
    let menuTotal = 0;

    for (let area in reportByArea) {
        reportByArea[area].forEach(day => {
            day.records.forEach(r => {
                timeTotal += r.timeMoney;
                menuTotal += r.menuMoney;
            });
        });
    }

    document.getElementById("modalTitle").innerText = "📊 DOANH THU HÔM NAY";

    document.getElementById("modalContent").innerHTML = `
        <table>
            <tr>
                <th>Loại</th>
                <th>Số tiền</th>
            </tr>
            <tr>
                <td>Tiền giờ</td>
                <td>${money(timeTotal)}</td>
            </tr>
            <tr>
                <td>Tiền menu</td>
                <td>${money(menuTotal)}</td>
            </tr>
            <tr>
                <th>TỔNG</th>
                <th>${money(timeTotal + menuTotal)}</th>
            </tr>
        </table>
        <button onclick="exportTodayReport()">Doanh thu hôm nay</button>

        <button onclick="resetToday()">🔄 Reset ngày</button>

    `;
let menuHtml = "<h3>ĐÃ BÁN TRONG KHO - MENU</h3>";

if (Object.keys(menuSoldToday).length === 0) {
    menuHtml += "<i>Chưa bán menu</i>";
} else {
    for (let item in menuSoldToday) {
        menuHtml += `<div>${item} : ${menuSoldToday[item]}</div>`;
    }
}

document.getElementById("modalContent").innerHTML += menuHtml;

    document.getElementById("revenueModal").style.display = "flex";
}

function resetToday() {
    if (!confirm("Reset toàn bộ doanh thu hôm nay?")) return;

    dailyRevenue = 0;
    reportByArea = { game:[], volleyball:[], football:[], bida:[] };

    localStorage.removeItem("dailyRevenue");
    localStorage.removeItem("reportByArea");
    menuSoldToday = {};

    updateDaily();
    closeRevenue();
}



function exportTodayReport() {
    let timeMoney = 0;
    let menuMoney = 0;

    for (let area in reportByArea) {
        reportByArea[area].forEach(day => {
            day.records.forEach(r => {
                timeMoney += r.timeMoney || 0;
                menuMoney += r.menuMoney || 0;
            });
        });
    }

    let total = timeMoney + menuMoney;

    let html = `
<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<title>Báo cáo doanh thu</title>
<style>
    body { font-family: Arial; padding: 20px; }
    h2 { color: #2e7d32; }
    table { width:100%; border-collapse: collapse; margin-top: 16px; }
    td, th { border:1px solid #ccc; padding:8px; }
    th { background:#f2f2f2; }
</style>
</head>
<body>

<h2>BÁO CÁO DOANH THU HÔM NAY</h2>

<table>
<tr><th>Hạng mục</th><th>Số tiền</th></tr>
<tr><td>Tiền giờ</td><td>${money(timeMoney)}</td></tr>
<tr><td>Tiền menu</td><td>${money(menuMoney)}</td></tr>
<tr><th>TỔNG</th><th>${money(total)}</th></tr>
</table>

<br>
<button onclick="window.print()">🖨 In báo cáo</button>

</body>
</html>
`;

    let w = window.open("", "_blank");
    w.document.open();
    w.document.write(html);
    w.document.close();
}

let saveTimeout = null;

function saveTableDebounced(tableId, data) {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
        saveTableState(tableId, data);
    }, 500);
}

document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        saveApp();
    }
});

window.addEventListener("beforeunload", () => {
    saveApp();
});

