/// CREDITS: https://github.com/afterburn/box-selection/blob/master/lib/box-selection.js

const SELECTION_MODES = {
    LOOSE: 'LOOSE',
    STRICT: 'STRICT'
}

class BoxSelection {
    config: any = {}
    mode: any
    itemSelector: any
    selectedClass: any
    selectionClass: any
    selection: HTMLElement | null
    container: any
    items: HTMLElement[]
    mouse: { current: { x: number; y: number }; start: { x: number; y: number }; isDragging: boolean }
    data: { left: number; top: number; scaleX: number; scaleY: number }

    constructor(config: any) {
        this.config = config
        this.mode = config.mode.toUpperCase() || SELECTION_MODES.LOOSE

        if (this.mode !== SELECTION_MODES.LOOSE && this.mode !== SELECTION_MODES.STRICT) {
            console.error(`[BoxSelection] Selection mode '${this.mode}' not recognized. Should be either 'strict' or 'loose'.`)
        }

        this.itemSelector = config.itemSelector.replace('.', '') || 'item'
        this.selectedClass = config.selectedClass.replace('.', '') || 'selected'
        this.selectionClass = config.selectionClass.replace('.', '') || 'selection'
        this.selection = null

        this.container = config.container || document.body
        this.container.style.userSelect = 'none'
        this.container.style.cursor = 'default'

        this.items = Array.from(this.container.querySelectorAll(`.${this.itemSelector}`))
        this.mouse = {
            current: { x: 0, y: 0 },
            start: { x: 0, y: 0 },
            isDragging: false
        }

        this.data = {
            left: 0,
            top: 0,
            scaleX: 0,
            scaleY: 0
        }

        this.bindEvents()
    }

    bindEvents() {
        this.mouseUp = this.mouseUp.bind(this)
        this.mouseDown = this.mouseDown.bind(this)
        this.mouseMove = this.mouseMove.bind(this)

        window.addEventListener('mouseup', this.mouseUp)
        window.addEventListener('mousedown', this.mouseDown)
        window.addEventListener('mousemove', this.mouseMove)
    }

    unbind() {
        window.removeEventListener('mouseup', this.mouseUp)
        window.removeEventListener('mousedown', this.mouseDown)
        window.removeEventListener('mousemove', this.mouseMove)
    }

    intersects(a: any, b: any) {
        if (this.mode === SELECTION_MODES.STRICT) {
            return b.left >= a.left && b.top >= a.top && b.right <= a.right && b.bottom <= a.bottom
        } else if (this.mode === SELECTION_MODES.LOOSE) {
            return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top
        }
        return false
    }

    getSelectedItems() {
        const selectionRect = this.selection!.getBoundingClientRect()
        return this.items.filter(item => this.intersects(selectionRect, item.getBoundingClientRect()))
    }

    updateSelection(selectedItems: any) {
        this.items.forEach(item => {
            if (selectedItems.indexOf(item) === -1) {
                item.classList.remove(this.selectedClass)
            } else {
                item.classList.add(this.selectedClass)
            }
        })
    }

    resetSelection() {
        if (this.selection) {
            document.body.removeChild(this.selection)
            this.selection = null
        }
    }

    applySelectionStyling() {
        if (!this.selection) return;
        this.selection.style.position = 'absolute'
        this.selection.style.willChange = 'transform'
        this.selection.style.transform = `translate3d(0, 0, 0) scale3d(0, 0, 0)`
        this.selection.style.transformOrigin = 'top left'
        this.selection.style.width = '100%'
        this.selection.style.height = '100vh'
        this.selection.style.top = "0px"
        this.selection.style.left = "0px"
        this.selection.style.pointerEvents = 'none'
    }

    mouseDown(e: any) {
        // check if de-block is in the path if yes we don't want to active the selection
        if (e.path.some((el: any) => el.classList && el.classList.contains('de-block'))) {
            this.resetSelection()
            this.mouse.isDragging = false
            // remove all selected items
            this.items.forEach(item => item.classList.remove(this.selectedClass))
            
            return;
        };
        
        this.resetSelection()
        this.mouse.start.x = e.clientX
        this.mouse.start.y = e.clientY
        this.mouse.isDragging = true
        this.selection = document.createElement('div')
        this.selection.classList.add(this.selectionClass)
        this.applySelectionStyling()
        document.body.appendChild(this.selection)
    }

    mouseMove(e: any) {
        this.mouse.current.x = e.clientX
        this.mouse.current.y = e.clientY

        if (this.mouse.isDragging) {
            const invertX = this.mouse.start.x > this.mouse.current.x
            const invertY = this.mouse.start.y > this.mouse.current.y
            const width = Math.abs(this.mouse.start.x - this.mouse.current.x)
            const height = Math.abs(this.mouse.start.y - this.mouse.current.y)

            // @ts-ignore
            const left = this.data.left = (invertX) ? e.clientX + 'px' : this.mouse.start.x + 'px'
            // @ts-ignore
            const top = this.data.top = (invertY) ? e.clientY + 'px' : this.mouse.start.y + 'px'

            const scaleX = this.data.scaleX = width / window.innerWidth
            const scaleY = this.data.scaleY = height / window.innerHeight

            this.selection!.style.transform = `translate3d(${left}, ${top}, 0) scale3d(${scaleX}, ${scaleY}, 1)`

            const selectedItems = this.getSelectedItems()
            this.config.onSelectionChange(selectedItems)
            this.updateSelection(selectedItems)
        }
    }

    mouseUp(e: any) {
        this.mouse.isDragging = false
        if (this.mouse.start.x === e.clientX && this.mouse.start.y === e.clientY) {
            if (!e.target.classList.contains(this.itemSelector)) {
                const selectedItems = this.getSelectedItems()
                this.updateSelection(selectedItems)
                this.config.onSelectionChange(selectedItems)
            } else {
                const selectedItems = [e.target]
                this.updateSelection(selectedItems)
                this.config.onSelectionChange(selectedItems)
            }
        }
        this.resetSelection()
    }
}

export default BoxSelection