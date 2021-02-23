$(document).ready(() => {
    const tds = document.querySelectorAll("td");
    const trash = document.querySelector("#trash");
    const turnPlace = document.querySelector(".turn");
    const turnPlaceColor = document.querySelector(".color");
    const endPage = document.querySelector(".endPage");
    const btnRestart = document.querySelector(".btn");
    let items = document.querySelectorAll("a");

    let piece = null;
    let placeToMove = [];
    let turn = 1;
    let endGame = false;
    let startGame = [];

    endPage.style.opacity = 0;
    setRestart();
    start();

    btnRestart.onclick = () => {
        restart();
    }

    //helper functions
    function changeTurn() {
        if (endGame) {
            turn = 0;
            return;
        }
        turn = (turn == 1) ? 2 : 1;
        turnPlace.setAttribute("data-player-turn", turn);
        turnPlaceColor.classList.toggle("black");
    }

    function clearPlaces() {
        tds.forEach(td => {
            td.classList.remove("place");
            td.classList.remove("place-enemy");
            td.select = false;
        });
    }

    function checkFull(td) {
        return td.children.length >= 1
    }

    function getTd(row, col) {
        return document.querySelector(`td[data-row='${row}'][data-col='${col}']`);
    }

    function getParent(el) {
        return el.parentNode;
    }

    function getChild(el) {
        return el.children[0];
    }

    function checkKing() {
        let kingHurt = false;
        const { places, parts } = setPlaceShadow(piece.getAttribute("class"), piece.getAttribute("data-player"), Number(getParent(piece).getAttribute("data-row")), Number(getParent(piece).getAttribute("data-col")), false);

        if (parts) {
            for (let place of places) {
                if (kingHurt) break;
                for (let { x, y } of place) {
                    if (getChild(getTd(x, y))) {
                        const child = getChild(getTd(x, y));
                        if (child.getAttribute("class") == "figure-4" && child.getAttribute("data-player") != turn) {
                            kingHurt = true;
                            break;
                        } else {
                            break;
                        }
                    }
                }
            }
        } else {
            for (let place of places) {
                if (!place) continue;
                const { x, y } = place;
                if (getChild(getTd(x, y))) {
                    const child = getChild(getTd(x, y));
                    if (child.getAttribute("class") == "figure-4" && child.getAttribute("data-player") != turn) {
                        kingHurt = true;
                        break;
                    }
                }
            }
        }


        if (kingHurt) alert("save your king!!!");

    }

    //main functions
    function setRestart() {
        for (const item of items) {
            startGame.push({ class: item.getAttribute("class"), player: item.getAttribute("data-player"), td: getParent(item) });
        }
    }

    function restart() {
        piece = null;
        placeToMove = [];
        turn = 1;
        endGame = false;
        items = [];
        for (let td of tds) {
            td.innerHTML = '';
        }
        for (const item of startGame) {
            let a = document.createElement("a");
            a.setAttribute("data-player", item.player);
            a.className = item.class;
            item.td.appendChild(a);
            items.push(a);
        }
        piece = null;
        placeToMove = [];
        turn = 1;
        endGame = false;
        trash.innerHTML = '';
        start();
    }

    function start() {
        for (let item of items) {
            item.onclick = () => {
                if (turn != Number(item.getAttribute("data-player"))) {
                    turnPlace.style.backgroundColor = "#111";
                    setTimeout(() => {
                        turnPlace.style.backgroundColor = "#EEE";
                    }, 500);
                    return;
                }
                placeToMove = [];
                piece = item;
                let name = item.getAttribute("class");
                let player = item.getAttribute("data-player");
                let row = getParent(item).getAttribute("data-row");
                let col = getParent(item).getAttribute("data-col");
                setPlaceShadow(name, player, Number(row), Number(col));
                movePiece();
            }
        }
    }

    function setShadow(places, soldier = false) {
        clearPlaces();
        if (soldier) {
            let { x, y } = places[0];
            let y_l = y - 1;
            let y_r = y + 1;
            if (y_l >= 1 && getChild(getTd(x, y_l))) {
                let td = getTd(x, y_l);
                if (getChild(td).getAttribute("data-player") != turn) {
                    td.classList.add("place-enemy");
                    placeToMove.push(td);
                    td.select = true;
                }
            }
            if (y_r <= 8 && getChild(getTd(x, y_r))) {
                let td = getTd(x, y_r);
                if (getChild(td).getAttribute("data-player") != turn) {
                    td.classList.add("place-enemy");
                    placeToMove.push(td);
                    td.select = true;
                }
            }

        }
        for (let place of places) {
            if (!place) continue;
            const { x, y } = place;
            const td = getTd(x, y);
            if (!checkFull(td)) {
                td.classList.add("place");
                placeToMove.push(td);
                td.select = true;
            } else {
                if (soldier) break;
                if (getChild(td).getAttribute("data-player") != turn) {
                    td.classList.add("place-enemy");
                    placeToMove.push(td);
                    td.select = true;
                }

            };
        }
    }

    function setShadows(places) {
        clearPlaces();
        for (let place of places) {
            for (const { x, y } of place) {
                const td = getTd(x, y);
                if (checkFull(td)) {
                    if (getChild(td).getAttribute("data-player") != turn) {
                        td.classList.add("place-enemy");
                        placeToMove.push(td);
                        td.select = true;
                    }
                    break
                };
                td.classList.add("place");
                placeToMove.push(td);
                td.select = true;
            }
        }
    }

    function setPlaceShadow(name, player, row, col, set = true) {
        if (set) {
            switch (name) {
                case "figure-1":
                    setShadows(figure_1());
                    break;

                case "figure-2":
                    setShadow(figure_2());
                    break;

                case "figure-3":
                    setShadows(figure_3());
                    break;

                case "figure-4":
                    setShadow(figure_4());
                    break;

                case "figure-5":
                    setShadows(figure_5());
                    break;

                case "figure-6":
                    setShadow(figure_6(), true);
                    break;

                default: break;
            }
        } else {
            switch (name) {
                case "figure-1":
                    return { places: figure_1(), parts: true };

                case "figure-2":
                    return { places: figure_2(), parts: false };

                case "figure-3":
                    return { places: figure_3(), parts: true };

                case "figure-4":
                    return { places: figure_4(), parts: false };

                case "figure-5":
                    return { places: figure_5(), parts: true };

                case "figure-6":
                    return { places: figure_6(), parts: false };

                default: break;
            }
        }

        //+ moves
        function right_row(row, col) {
            let arr = [];
            for (let i = col + 1; i <= 8; i++) {
                arr.push({ x: row, y: i });
            }
            return arr;
        }
        function left_row(row, col) {
            let arr = [];
            for (let i = col - 1; i >= 1; i--) {
                arr.push({ x: row, y: i });
            }
            return arr;
        }
        function bottom_col(row, col) {
            let arr = [];
            for (let i = row + 1; i <= 8; i++) {
                arr.push({ x: i, y: col });
            }
            return arr;
        }
        function top_col(row, col) {
            let arr = [];
            for (let i = row - 1; i >= 1; i--) {
                arr.push({ x: i, y: col });
            }
            return arr;
        }


        //X moves
        function x_r_b(row, col) {
            let arr = []
            for (let i = 1; row + i <= 8 && col + i <= 8; i++) {
                arr.push({ x: row + i, y: col + i })
            }
            return arr;
        }
        function x_r_t(row, col) {
            let arr = []
            for (let i = 1; row - i >= 1 && col + i <= 8; i++) {
                arr.push({ x: row - i, y: col + i })
            }
            return arr;
        }
        function x_l_b(row, col) {
            let arr = []
            for (let i = 1; row + i <= 8 && col - i >= 1; i++) {
                arr.push({ x: row + i, y: col - i })
            }
            return arr;
        }
        function x_l_t(row, col) {
            let arr = []
            for (let i = 1; row - i >= 1 && col - i >= 1; i++) {
                arr.push({ x: row - i, y: col - i })
            }
            return arr;
        }


        //L move
        function l_move(row, col) {
            let arr = [];

            if (right_row(row, col)[1]) {
                let r_y = right_row(row, col)[1].y;
                let r_x_1 = row - 1;
                let r_x_2 = row + 1;
                if (r_x_1 >= 1)
                    arr.push({ y: r_y, x: r_x_1 });
                if (r_x_2 <= 8)
                    arr.push({ y: r_y, x: r_x_2 });
            }

            if (top_col(row, col)[1]) {
                let t_x = top_col(row, col)[1].x;
                let t_y_1 = col - 1;
                let t_y_2 = col + 1;
                if (t_y_1 >= 1)
                    arr.push({ y: t_y_1, x: t_x });
                if (t_y_2 <= 8)
                    arr.push({ y: t_y_2, x: t_x });
            }

            if (left_row(row, col)[1]) {
                let l_y = left_row(row, col)[1].y;
                let l_x_1 = row - 1;
                let l_x_2 = row + 1;
                if (l_x_1 >= 1)
                    arr.push({ y: l_y, x: l_x_1 });
                if (l_x_2 <= 8)
                    arr.push({ y: l_y, x: l_x_2 });
            }


            if (bottom_col(row, col)[1]) {
                let b_x = bottom_col(row, col)[1].x;
                let b_y_1 = col - 1;
                let b_y_2 = col + 1;
                if (b_y_1 >= 1)
                    arr.push({ y: b_y_1, x: b_x });
                if (b_y_2 <= 8)
                    arr.push({ y: b_y_2, x: b_x });
            }

            return arr;
        }

        //items
        function figure_1() {
            let place = [];
            place.push(right_row(row, col), bottom_col(row, col), left_row(row, col), top_col(row, col));
            return place;
        }

        function figure_2() {
            return l_move(row, col);
        }

        function figure_3() {
            let place = [];
            place.push(x_r_b(row, col), x_l_b(row, col), x_l_t(row, col), x_r_t(row, col));
            return place;
        }

        function figure_4() {
            let place = [];
            place.push(x_r_b(row, col)[0], x_l_b(row, col)[0], x_l_t(row, col)[0], x_r_t(row, col)[0]);
            place.push(right_row(row, col)[0], bottom_col(row, col)[0], left_row(row, col)[0], top_col(row, col)[0]);
            return place;
        }

        function figure_5() {
            let place = [];
            place.push(x_r_b(row, col), x_l_b(row, col), x_l_t(row, col), x_r_t(row, col));
            place.push(right_row(row, col), bottom_col(row, col), left_row(row, col), top_col(row, col));
            return place;
        }

        function figure_6() {
            let place = [];

            if (player == 1) {
                place.push(top_col(row, col)[0]);
                if (row == 7) {
                    place.push(top_col(row, col)[1]);
                }
            } else {
                place.push(bottom_col(row, col)[0]);
                if (row == 2) {
                    place.push(bottom_col(row, col)[1]);
                }
            }

            return place;
        }
    }

    function setWin() {
        endPage.style.opacity = 1;
        let endPageColor = document.querySelector(".endPage > .winner > .color");
        if (turn != 1) endPageColor.classList.add("black");
        endGame = true;
    }

    function moveToTrash(el) {
        if (el.getAttribute("class") == "figure-4") setWin();
        trash.appendChild(el);
    }

    function changeToQueen() {
        piece.className = "figure-5";
    }

    function movePiece() {
        if (!piece) return;
        for (let td of placeToMove) {
            td.onclick = () => {
                if (!td.select) return;
                if (getChild(td)) moveToTrash(getChild(td));
                td.appendChild(piece);
                if (piece.getAttribute("class") == "figure-6" && (td.getAttribute("data-row") == 1 || td.getAttribute("data-row") == 8)) changeToQueen();
                checkKing();
                clearPlaces();
                changeTurn();
            }
        }
    }
})