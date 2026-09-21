"use strict";
(async () => {
  const status = document.getElementById("status");
  try {
    const container = document.getElementById("viewerContainer");
    const eventBus = new pdfjsViewer.EventBus();
    const linkService = new pdfjsViewer.PDFLinkService({ eventBus, externalLinkTarget: 2 });
    const viewer = new pdfjsViewer.PDFViewer({ container, eventBus, linkService,
      annotationMode: 1, textLayerMode: 1 });
    linkService.setViewer(viewer);
    const input = document.getElementById("pageNumber");
    const prev = document.getElementById("prev"), next = document.getElementById("next");
    const zoom = document.getElementById("zoom");
    const updatePage = () => {
      input.value = viewer.currentPageNumber;
      prev.disabled = viewer.currentPageNumber <= 1;
      next.disabled = viewer.currentPageNumber >= viewer.pagesCount;
    };
    eventBus.on("pagesinit", () => {
      viewer.currentScaleValue = "page-width";
      document.querySelectorAll("#toolbar button,#toolbar input,#toolbar select").forEach(el => el.disabled = false);
      input.max = viewer.pagesCount;
      document.getElementById("pageCount").textContent = `/ ${viewer.pagesCount}`;
      updatePage();
    });
    eventBus.on("pagerendered", () => { status.hidden = true; });
    eventBus.on("pagechanging", updatePage);
    prev.onclick = () => { viewer.currentPageNumber -= 1; };
    next.onclick = () => { viewer.currentPageNumber += 1; };
    input.onchange = () => {
      viewer.currentPageNumber = Math.max(1, Math.min(viewer.pagesCount, Number(input.value) || 1));
      updatePage();
    };
    zoom.onchange = () => { viewer.currentScaleValue = zoom.value; };
    const setZoom = factor => {
      viewer.currentScale = Math.max(.25, Math.min(4, viewer.currentScale * factor));
      let custom = document.getElementById("customZoom");
      if (!custom) { custom = document.createElement("option"); custom.id = "customZoom"; zoom.append(custom); }
      custom.value = viewer.currentScale; custom.textContent = `${Math.round(viewer.currentScale * 100)}%`;
      zoom.value = custom.value;
    };
    document.getElementById("zoomOut").onclick = () => setZoom(1 / 1.2);
    document.getElementById("zoomIn").onclick = () => setZoom(1.2);
    window.addEventListener("resize", () => {
      if (zoom.value.startsWith("page-")) viewer.currentScaleValue = zoom.value;
    });
    const data = Uint8Array.from(atob(window.SIMPT_PDF_BASE64), c => c.charCodeAt(0));
    delete window.SIMPT_PDF_BASE64;
    const pdf = await pdfjsLib.getDocument({ data, isEvalSupported: false }).promise;
    viewer.setDocument(pdf); linkService.setDocument(pdf);
  } catch (error) {
    status.textContent = "The PDF could not be loaded. Please reload the page.";
    console.error("PDF reader:", error);
  }
})();
