window.addEventListener('message', msg => {
    let act = msg.data.act
    if(act === 'prop'){
        document.body.style.display = 'block'
    }
    if(act === 'close'){
        document.body.style.display = 'none'
    }
})

document.onkeyup = ev => {
    if(ev.key === 'Escape') {
        $.post(`https://${GetParentResourceName()}/close`)
        document.body.style.display = 'none'
    }
}

let inputs = document.body.querySelectorAll('input[type = "range"]')

for(let input of inputs){
    input.addEventListener('input', (event) =>{
        input.parentNode.querySelector('.val').innerHTML = input.value
        let chooseObject = document.querySelector('#choose-object')
        if(chooseObject.querySelector('.selected')){
            let id = chooseObject.querySelector('.selected').querySelector('#prop-id').innerHTML
            let propData = getPropData()
            $.post(`https://${GetParentResourceName()}/updateProp`,JSON.stringify({id : id, propData : propData}))
        }
    })
}


function deleteProp(){
    let chooseObject = document.querySelector('#choose-object')
    if(chooseObject.querySelector('.selected')){
        let selected = chooseObject.querySelector('.selected')
        selected.classList.remove('selected')
        let id = selected.querySelector('#prop-id').innerHTML
        selected.remove()
        clearPropData()
        $.post(`https://${GetParentResourceName()}/deleteProp`,JSON.stringify(id))
    }
}



let props = {}


function getPropData()
{
    let propName = document.body.querySelector('#prop-name').querySelector('input').value
    let pedBone = document.body.querySelector('#ped-bone').querySelector('select')
    pedBone = pedBone[pedBone.selectedIndex].dataset.boneid
    let xPos = document.body.querySelector('#pos-x').querySelector('input[type = "range"]').value
    let yPos = document.body.querySelector('#pos-y').querySelector('input[type = "range"]').value
    let zPos = document.body.querySelector('#pos-z').querySelector('input[type = "range"]').value
    let xRot = document.body.querySelector('#rot-x').querySelector('input[type = "range"]').value
    let yRot = document.body.querySelector('#rot-y').querySelector('input[type = "range"]').value
    let zRot = document.body.querySelector('#rot-z').querySelector('input[type = "range"]').value
    return {propName : propName, pedBone : pedBone, xPos : xPos, yPos : yPos, zPos : zPos, xRot : xRot, yRot : yRot, zRot : zRot}
}
function setPropData(propData) {

    document.body.querySelector('#prop-name').querySelector('input').value = propData.propName

    let select = document.body.querySelector('#ped-bone').querySelector('select')



    for(let i = 0; i < 16; i++){
        if(select[i].dataset.boneid === propData.pedBone){
            select.selectedIndex = i
        }
    }

    document.body.querySelector('#pos-x').querySelector('input[type = "range"]').value = propData.xPos
    document.body.querySelector('#pos-x').querySelector('.val').innerHTML = propData.xPos
    document.body.querySelector('#pos-y').querySelector('input[type = "range"]').value = propData.yPos
    document.body.querySelector('#pos-y').querySelector('.val').innerHTML = propData.yPos
    document.body.querySelector('#pos-z').querySelector('input[type = "range"]').value = propData.zPos
    document.body.querySelector('#pos-z').querySelector('.val').innerHTM = propData.zPos
    document.body.querySelector('#rot-x').querySelector('input[type = "range"]').value = propData.xRot
    document.body.querySelector('#rot-x').querySelector('.val').innerHTM = propData.xRot
    document.body.querySelector('#rot-y').querySelector('input[type = "range"]').value = propData.yRot
    document.body.querySelector('#rot-y').querySelector('.val').innerHTM = propData.yRot
    document.body.querySelector('#rot-z').querySelector('input[type = "range"]').value = propData.zRot
    document.body.querySelector('#rot-z').querySelector('.val').innerHTM = propData.zRot
}

function clearPropData() {
    document.body.querySelector('#pos-x').querySelector('input[type = "range"]').value = 0
    document.body.querySelector('#pos-y').querySelector('input[type = "range"]').value = 0
    document.body.querySelector('#pos-z').querySelector('input[type = "range"]').value = 0
    document.body.querySelector('#rot-x').querySelector('input[type = "range"]').value = 0
    document.body.querySelector('#rot-y').querySelector('input[type = "range"]').value = 0
    document.body.querySelector('#rot-z').querySelector('input[type = "range"]').value = 0
    document.body.querySelector('#prop-name').querySelector('input').value = ''
    let select = document.body.querySelector('#ped-bone').querySelector('select')
    select.selectedIndex = 0
}

function startAnim() {
    let dict = document.body.querySelector('#animDict').querySelector('input').value
    let anim = document.body.querySelector('#animName').querySelector('input').value

    if(anim !== '' && dict !== ''){
        $.post(`https://${GetParentResourceName()}/playAnim`, JSON.stringify({anim : anim, dict : dict}))
    }
}
function stopAnim() {
    $.post(`https://${GetParentResourceName()}/stopAnim`)
}

function addProp() {
    let propData = getPropData()
    clearPropData()
    if(propData.propName === '') return
    let id = `Object#${Object.keys(props).length}`
    $.post(`https://${GetParentResourceName()}/addProp`, JSON.stringify({id : id, propData : propData}), resp =>{
        console.log(resp)
        if(resp === 'ok'){
            let div = document.createElement('div')
            let p1 = document.createElement('p')
            p1.innerHTML = `Object#${Object.keys(props).length}`
            p1.id = 'prop-id'
            let p2 = document.createElement('p')
            p2.innerHTML =  propData.propName
            div.appendChild(p1)
            div.appendChild(p2)
            let chooseObject = document.querySelector('#choose-object')
            div.onclick =  (event) =>{
                if(chooseObject.querySelector('.selected')){
                    chooseObject.querySelector('.selected').classList.remove('selected')
                }
                div.classList.add('selected')
                let id = p1.innerHTML
                let name = p2.innerHTML
                setPropData(props[id])
            }
            props[id] = propData
            chooseObject.appendChild(div)
        }
    })
}

function propData() {
    let propData = getPropData()
    let data = `local ped = PlayerPedId()
    local x,y,z = table.unpack(GetEntityCoords(ped))
    local prop = CreateObject(GetHashKey('${propData.propName}'), x, y, z-2.0,  true,  true, true)
    AttachEntityToEntity(prop, ped, GetPedBoneIndex(ped, ${propData.pedBone}), ${propData.xPos}, ${propData.yPos}, ${propData.zPos}, ${propData.xRot}, ${propData.yRot}, ${propData.zRot}, true, true, false, true, 1, true)
`
    document.body.querySelector('#propData').value = data
}


let header = document.body.querySelector('#header-wrapper')

header.onmousedown = function(event) {
    if (event.target.tagName === 'BUTTON') return
    let wrapper = document.body.querySelector('#wrapper')
    let shiftX = event.clientX - wrapper.getBoundingClientRect().left;
    let shiftY = event.clientY - wrapper.getBoundingClientRect().top;
    wrapper.style.position = 'absolute';
    wrapper.style.zIndex = 1000;
    document.body.append(wrapper);

    moveAt(event.pageX, event.pageY);

    // переносит мяч на координаты (pageX, pageY),
    // дополнительно учитывая изначальный сдвиг относительно указателя мыши
    function moveAt(pageX, pageY) {
        wrapper.style.left = pageX - shiftX + 'px';
        wrapper.style.top = pageY - shiftY + 'px';
    }

    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
    }

    // передвигаем мяч при событии mousemove
    document.addEventListener('mousemove', onMouseMove);

    // отпустить мяч, удалить ненужные обработчики
    wrapper.onmouseup = function() {
        document.removeEventListener('mousemove', onMouseMove);
        wrapper.onmouseup = null;
    };

};

header.ondragstart = function() {
    return false;
};
