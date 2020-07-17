local objects = {}

local function addProp(id,data)
    RequestModel(GetHashKey(data.propName))
    while not HasModelLoaded(GetHashKey(data.propName)) do
        Citizen.Wait(200)
    end
    local ped = PlayerPedId()
    local x,y,z = table.unpack(GetEntityCoords(ped))
    local prop = CreateObject(GetHashKey(data.propName), x, y, z-2.0,  true,  true, true)
    if tonumber(data.xPos) % 1 == 0 then data.xPos =data.xPos..'.0' end
    if tonumber(data.yPos) % 1 == 0 then data.yPos =data.yPos..'.0' end
    if tonumber(data.zPos) % 1 == 0 then data.zPos =data.zPos..'.0' end
    if tonumber(data.xRot) % 1 == 0 then data.xRot =data.xRot..'.0' end
    if tonumber(data.yRot) % 1 == 0 then data.yRot =data.yRot..'.0' end
    if tonumber(data.zRot) % 1 == 0 then data.zRot =data.zRot..'.0' end
    AttachEntityToEntity(prop, ped, GetPedBoneIndex(ped, tonumber(data.pedBone)), tonumber(data.xPos), tonumber(data.yPos), tonumber(data.zPos), tonumber(data.xRot), tonumber(data.yRot), tonumber(data.zRot), true, true, false, true, 1, true)
    objects[id] = prop
end

local function updateProp(id,data)
    local prop = objects[id]
    if prop then
        DeleteEntity(prop)
        addProp(id,data)

    end
end

local function playAnim(dict,anim)
    if DoesAnimDictExist(dict) then
        local ped = PlayerPedId()
        RequestAnimDict(dict)
        while not HasAnimDictLoaded(dict) do
            Citizen.Wait(200)
        end
        TaskPlayAnim(ped, dict, anim, 4.0, 1.0, -1, 1, 0, 0, 0, 0 )
    end
end



RegisterCommand('prop', function ()
    SetNuiFocus(true,true)
    SendNUIMessage({
        act = 'prop'
    })
end)
RegisterCommand('close', function ()
    SetNuiFocus(false,false)
    SendNUIMessage({
        act = 'close'
    })
end)

RegisterNUICallback('addProp',function (data,cb)
    if IsModelValid(data.propData.propName) and not IsModelAVehicle(data.propData.propName) and not IsModelAPed(data.propData.propName) then
        cb('ok')
        addProp(data.id,data.propData)
    end
end)

RegisterNUICallback('updateProp',function (data)
    updateProp(data.id, data.propData)
end)

RegisterNUICallback('deleteProp',function (id)
    DeleteEntity(objects[id])
    objects[id] = nil
end)

RegisterNUICallback('playAnim',function (data)
    playAnim(data.dict, data.anim)
end)

RegisterNUICallback('stopAnim',function ()
    ClearPedTasks(PlayerPedId())
end)

RegisterNUICallback('close',function (data,cb)
    SetNuiFocus(false,false)
end)

