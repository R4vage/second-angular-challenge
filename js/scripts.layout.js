
let layout

async function getLayout() {
    const respFooter = await fetch("layout/footer.html");
    const respNav = await fetch("layout/navBar.html")
    const htmlFooter = await respFooter.text();
    const htmlNavBar = await respNav.text();
    document.body.insertAdjacentHTML("beforeend", htmlFooter);
    document.body.insertAdjacentHTML("afterBegin", htmlNavBar);
}

getLayout()
