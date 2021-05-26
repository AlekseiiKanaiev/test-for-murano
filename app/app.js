function fillData(data){
    let isFilling = false;
    let isUserPressAdd = false;
    const event = new Event('input', { bubbles: true});
    event.simulated = true;
    const clickEvent = new MouseEvent('click', { bubbles: true});
    clickEvent.simulated = true;

    if (!isFilling) {
        isFilling = true;
        const generalInfoEl = Array.from(document.querySelectorAll('.MuiTextField-root'));
        generalInfoEl.forEach(item => {
            const el = $(item).find('input');
            if (item.innerText.includes('Name')){
                const value = data.name || '';
                changeValue(el[0], value);
            }
            else if (item.innerText.includes('Email')){
                const value = data.email || '';
                changeValue(el[0], value);
            }
            else if (item.innerText.includes('Primary')){
                const value = data.firstPhone || '';
                changeValue(el[0], value);
            }
            else if (item.innerText.includes('Secondary')){
                const value = data.secondaryPhone || '';
                changeValue(el[0], value);
            }
            else if (item.innerText.includes('Business Description')){
                let value = data.desc || '';
                if (value) value = value.slice(0, 20);
                changeValue(el[0], value);
            }
        });

        const tableRows = Array.from(document.querySelectorAll('.MuiTableRow-root'));
        if (tableRows.length > 1) {
            tableRows.reverse().forEach(elem => {
                const elems = Array.from(elem.querySelectorAll('td'));
                if (elems.length) {
                    const deleteButton = elems[elems.length - 1].querySelector('svg');
                    deleteButton.dispatchEvent(clickEvent);
                }
            })
        }
        if (data.workers.length) {
            setAllFields(data.workers);
        }
    }

    function changeValue(input, value){
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
            window.HTMLInputElement.prototype,
            "value"
        ).set;

        nativeInputValueSetter.call(input, value);
        input.dispatchEvent(event);
    }

    async function setAllFields(workers){
        isFilling = true;
        const button = $(".MuiButtonBase-root.MuiButton-root.MuiButton-contained.MuiButton-containedPrimary");
        for (let worker of workers){
            button[0].dispatchEvent(clickEvent);
            await setFields(worker);
            await setWorkField(worker);
            await waitClose();
        }
        isFilling = false;
    }

    function setFields(worker){
        return new Promise(resolve => {
            const t = setInterval(function () {
                if (document.querySelector('.MuiDialogContent-root')) {
                    clearInterval(t);
                    document.querySelector('.MuiDialog-container').querySelector('.MuiButton-containedPrimary').addEventListener('click', (e) => listenerHandler(e, worker));
                    listenerHandler(null, worker);
                    resolve();
                }
            }, 50);
        }).then()
    }

    function setWorkField(worker){
        return new Promise(res => {
            setTimeout(() => {
                const dialog = document.querySelector('.MuiDialog-container');
                const input = Array.from(document.querySelector('.MuiDialogContent-root').querySelectorAll('.MuiFormControl-root')).find(item => item.innerText.includes('Work'));
                if (input) {
                    const el = $(input).find('input');
                    const value = worker.experience ? +worker.experience : '';
                    setField(el[0], value);
                }
                const button = dialog.querySelector('.MuiButton-containedPrimary');
                button.dispatchEvent(clickEvent);
                res();
            })
        }).then();
    }

    function waitClose() {
        return new Promise((resolve) => {
            document.querySelector('.MuiDialog-container').querySelector('.MuiButton-containedPrimary').removeEventListener('click', (e) => listenerHandler(e));
            const t = setInterval(function () {
                if (!document.querySelector('.MuiDialog-container')){
                    clearInterval(t);
                    isUserPressAdd = false;
                    resolve();
                }
            }, 50)
        }).then()
    }

    function setField(field, value){
        if (isUserPressAdd){
            if (value)  changeValue(field, value);
        } else {
            changeValue(field, value);
        }
    }

    function listenerHandler(e, worker) {
        if (e) isUserPressAdd = true;
        const inputs = Array.from(document.querySelector('.MuiDialogContent-root').querySelectorAll('.MuiFormControl-root'));
        inputs.forEach(item => {
            const el = $(item).find('input');
            if (item.innerText.includes('First Name')){
                const value = worker.firstName || '';
                setField(el[0], value);
            }
            else if (item.innerText.includes('Last Name')){
                const value = worker.lastName || '';
                setField(el[0], value);
            }
            else if (item.innerText.includes('Job')){
                const value = worker.job || '';
                setField(el[0], value);
            }
            else if (item.innerText.includes('Birthday')){
                let value = worker.dob || '';
                if (value) {
                    const split = value.split('-');
                    value = [split[1],split[2],split[0]].join('-');
                }
                setField(el[0], value);
            }
            else if (item.localName.includes('fieldset')){
                const value = worker.gender || '';
                if (isUserPressAdd){
                    if (value) {
                        const el = Array.from(item.querySelectorAll('input')).find(item => item.value === value);
                        if (el) el.dispatchEvent(clickEvent);
                    }
                } else {
                    const el = Array.from(item.querySelectorAll('input')).find(item => item.value === value);
                    if (el) el.dispatchEvent(clickEvent);
                }
            }
            else if (item => item.innerText.includes('Work')){
                const value = worker.experience ? +worker.experience : '';
                if (isUserPressAdd){
                    if (value !== '')  changeValue(el[0], value);
                } else {
                    changeValue(el[0], value);
                }
            }
        });
    }
}
