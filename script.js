const PRICE = {
    bida: 30000,
    game: 20000,
    volley: 70000,
    football5: 150000,
    football7: 300000
};

const menuList = [
    { name: "Nước ngọt", price: 15000 },
    { name: "Bia", price: 20000 },
    { name: "Mì ly", price: 25000 }
];

let dailyRevenue = 0;

function money(n) {
    return n.toLocaleString("vi-VN") + " đ";
}
function time(t) {
    return t.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
}
function updateDaily() {
    document.getElementById("dailyTotal").innerText = money(dailyRevenue);
}

function createArea(areaId, count, pricePerHour, label) {
    const area = document.getElementById(areaId);

    for (let i = 1; i <= count; i++) {
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <h3>${label} ${i}</h3>
            <button class="mode-after">Trả sau</button>
            <button class="mode-before">Trả trước</button>

            <input class="prepaid" type="number" placeholder="Tiền trả trước" style="display:none">

            <button class="start">▶ Bắt đầu</button>
            <button class="end">■ Kết thúc</button>

            <div class="menu-toggle">☰ Menu</div>
            <div class="menu"></div>

            <div class="info"></div>
        `;

        area.appendChild(card);

        let mode = null;
        let startTime = null;
        let endTime = null;
        let timer = null;
        let menuTotal = 0;
        let menuCount = {};

        const btnAfter = card.querySelector(".mode-after");
        const btnBefore = card.querySelector(".mode-before");
        const startBtn = card.querySelector(".start");
        const endBtn = card.querySelector(".end");
        const prepaidInput = card.querySelector(".prepaid");
        const menuDiv = card.querySelector(".menu");
        const toggleMenu = card.querySelector(".menu-toggle");
        const info = card.querySelector(".info");

        // MENU
        menuList.forEach(item => {
            menuCount[item.name] = 0;
            const row = document.createElement("div");
            row.className = "menu-item";
            row.innerHTML = `
                <span>${item.name}</span>
                <div>
                    <button>-</button>
                    <span class="qty">0</span>
                    <button>+</button>
                </div>
            `;
            const qty = row.querySelector(".qty");
            const btns = row.querySelectorAll("button");

            btns[0].onclick = () => {
                if (menuCount[item.name] > 0) {
                    menuCount[item.name]--;
                    menuTotal -= item.price;
                    qty.innerText = menuCount[item.name];
                }
            };

            btns[1].onclick = () => {
                menuCount[item.name]++;
                menuTotal += item.price;
                qty.innerText = menuCount[item.name];
            };

            menuDiv.appendChild(row);
        });

        toggleMenu.onclick = () => {
            menuDiv.style.display = menuDiv.style.display === "block" ? "none" : "block";
        };

        function renderInfo() {
            info.innerHTML = `
                Giờ bắt đầu: ${startTime ? time(startTime) : "-"}<br>
                ${endTime ? "Giờ kết thúc: " + time(endTime) + "<br>" : ""}
                Tiền menu: ${money(menuTotal)}
            `;
        }

        btnAfter.onclick = () => {
            mode = "after";
            prepaidInput.style.display = "none";
        };

        btnBefore.onclick = () => {
            mode = "before";
            prepaidInput.style.display = "block";
        };

        startBtn.onclick = () => {
            if (!mode) {
                alert("Chọn Trả trước hoặc Trả sau");
                return;
            }

            if (mode === "before" && !prepaidInput.value) {
                alert("Nhập tiền trả trước");
                return;
            }

            startTime = new Date();
            card.classList.add("playing");

            if (mode === "before") {
                const prepaid = Number(prepaidInput.value);
                const minutes = Math.floor((prepaid / pricePerHour) * 60);
                endTime = new Date(startTime.getTime() + minutes * 60000);
            }

            renderInfo();
            timer = setInterval(renderInfo, 1000);
        };

        endBtn.onclick = () => {
            if (!startTime) return;

            clearInterval(timer);
            endTime = new Date();
            card.classList.remove("playing");

            const usedMinutes = Math.ceil((endTime - startTime) / 60000);
            const usedMoney = Math.ceil((usedMinutes / 60) * pricePerHour);

            let refund = 0;
            let prepaid = 0;

            if (mode === "before") {
                prepaid = Number(prepaidInput.value);
                refund = prepaid - usedMoney - menuTotal;
                if (refund < 0) refund = 0;
            }

            dailyRevenue += usedMoney + menuTotal;
            updateDaily();

            alert(
                `Thời gian: ${usedMinutes} phút\n` +
                `Tiền giờ: ${money(usedMoney)}\n` +
                `Tiền menu: ${money(menuTotal)}\n` +
                (mode === "before"
                    ? `Tiền trả trước: ${money(prepaid)}\nTrả lại khách: ${money(refund)}`
                    : "")
            );

            // reset
            prepaidInput.value = "";
            menuTotal = 0;
            menuCount = {};
            startTime = null;
            endTime = null;
            renderInfo();
        };
    }
}

// TẠO KHU
createArea("bidaArea", 14, PRICE.bida, "Bida");
createArea("netArea", 3, PRICE.game, "Game");
createArea("volleyArea", 1, PRICE.volley, "Sân");
createArea("football5Area", 2, PRICE.football5, "Sân 5v5");
createArea("football7Area", 1, PRICE.football7, "Sân 7v7");
