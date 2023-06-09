import { Switch } from '@magickml/client-core'
import { Avatar, Button, Typography } from '@mui/material'
import styles from './index.module.scss'
import { useEffect, useState } from 'react'
import AgentPubVariables from './AgentPubVariables'
import axios from 'axios'
import { enqueueSnackbar } from 'notistack'
import { useConfig } from '../../../contexts/ConfigProvider'
import { pluginManager } from '@magickml/engine'
import { Input } from '@mui/material'

const RenderComp = props => {
  return <props.element props={props} />
}

const AgentDetails = ({
  selectedAgentData,
  setSelectedAgentData,
  updateCallback,
}) => {
  const [spellList, setSpellList] = useState<any[]>([])
  const [rootSpell, setRootSpell] = useState<any>({})
  const config = useConfig()

  const update = id => {
    const _data = selectedAgentData
    if (_data.hasOwnProperty('id')) {
      delete _data.id
    }
    console.log('update', _data)
    // Avoid server-side validation error
    _data.spells = Array.isArray(_data?.spells) ? _data.spells : []
    _data.dirty = true
    _data.enabled = _data.enabled ? true : false
    _data.updatedAt = new Date().toISOString()
    axios
      .patch(`${config.apiUrl}/agents/${id}`, _data)
      .then(res => {
        if (typeof res.data === 'string' && res.data === 'internal error') {
          enqueueSnackbar('internal error updating agent', {
            variant: 'error',
          })
        } else {
          enqueueSnackbar('updated agent', {
            variant: 'success',
          })

          updateCallback()
        }
      })
      .catch(e => {
        console.error('ERROR', e)
        enqueueSnackbar('internal error updating entity', {
          variant: 'error',
        })
      })
  }

  const exportEntity = () => {
    const fileName = 'agent'
    const json = JSON.stringify(selectedAgentData)
    const blob = new Blob([json], { type: 'application/json' })
    const url = window.URL.createObjectURL(new Blob([blob]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `${fileName}.ent.json`)
    // Append to html link element page
    document.body.appendChild(link)
    // Start download
    link.click()
    if (!link.parentNode) return
    // Clean up and remove the link
    link.parentNode.removeChild(link)
  }

  useEffect(() => {
    if ( selectedAgentData?.rootSpell !== '{}') {
      console.log('JSON.parse(selectedAgentData.rootSpell)', JSON.parse(selectedAgentData.rootSpell))
      setRootSpell(JSON.parse(selectedAgentData.rootSpell).name)
    } else {
      setRootSpell({})
    }
    ;(async () => {
      const res = await fetch(
        `${config.apiUrl}/spells?projectId=${config.projectId}`
      )
      const json = await res.json()

      setSpellList(json.data)
    })()
  }, [])

  return (
    <div>
      <div className={`${styles.agentDetailsContainer}`}>
        <div className={styles.agentDescription}>
          <Avatar className={styles.avatar}>A</Avatar>
          <div>
            <Typography variant="h5">{selectedAgentData.name}</Typography>
          </div>
        </div>
        <div className={styles.btns}>
          <Button
            onClick={() => {
              update(selectedAgentData?.id)
            }}
            style={{
              margin: '1em',
              color: 'white',
              backgroundColor: 'purple',
            }}
          >
            Update
          </Button>
          <Button
            style={{
              margin: '1em',
              color: 'white',
              backgroundColor: 'purple',
            }}
            onClick={() => exportEntity()}
          >
            Export
          </Button>
        </div>
        <Switch
          label={null}
          checked={selectedAgentData.enabled ? true : false}
          onChange={() => {
            setSelectedAgentData({
              ...selectedAgentData,
              enabled: selectedAgentData.enabled ? false : true,
            })
          }}
          style={{ alignSelf: 'self-start' }}
        />
      </div>
      <div className="form-item agent-select">
        <span className="form-item-label">Root Spell</span>
        <select
          style={{
            appearance: 'none',
          }}
          name="rootSpell"
          id="rootSpell"
          value={JSON.parse(selectedAgentData.rootSpell).name || 'default'}
          onChange={event => {
            console.log('event', event.target.value)
            setRootSpell(event.target.value)
            const newRootSpell = spellList.find(
              spell => spell.name === event.target.value
            )
            console.log('newRootSpell', newRootSpell)
            setSelectedAgentData({
              ...selectedAgentData,
              rootSpell: JSON.stringify(newRootSpell),
              publicVariables: JSON.stringify(
                Object.values(newRootSpell.graph.nodes as any)
                  // get the public nodes
                  .filter((node: { data }) => node?.data?.isPublic)
                  // map to an array of objects
                  .map((node: { data; id }) => {
                    return {
                      id: node?.id,
                      name: node?.data?.name,
                      value: node?.data?.value,
                    }
                  })
                  // map to an object with the id as the key
                  .reduce((acc, cur) => {
                    acc[cur.id] = cur
                    return acc
                  }, {})
              ),
            })
          }}
        >
          <option disabled value={'default'} key={0}>
            Select Spell
          </option>
          {spellList?.length > 0 &&
            spellList.map((spell, idx) => (
              <option value={spell.name} key={idx}>
                {spell.name}
              </option>
            ))}
        </select>
      </div>
      <div>
        {pluginManager.getSecrets(true).map((value, index, array) => {
          return (
            <div key={value.name+index} style={{ marginBottom: '1em' }}>
              <div style={{ width: '100%', marginBottom: '1em' }}>
                {value.name}
              </div>
              <Input
                type="password"
                name={value.key}
                id={value.key}
                style={{ width: '100%' }}
                value={
                  selectedAgentData.secrets
                    ? JSON.parse(selectedAgentData.secrets)[value.key]
                    : null
                }
                onChange={event => {
                  setSelectedAgentData({
                    ...selectedAgentData,
                    secrets: JSON.stringify({
                      ...JSON.parse(selectedAgentData.secrets),
                      [value.key]: event.target.value,
                    }),
                  })
                }}
              />
            </div>
          )
        })}
      </div>
      <div
        style={{
          height: `${
            selectedAgentData.public &&
            selectedAgentData.publicVariables !== '[]'
              ? 'auto'
              : '150px'
          }`,
          overflow: 'auto',
          marginBottom: '10px',
        }}
      >
        {selectedAgentData.publicVariables &&
          selectedAgentData.publicVariables !== '[]' && (
            <AgentPubVariables
              setPublicVars={data => {
                setSelectedAgentData({
                  ...selectedAgentData,
                  publicVariables: JSON.stringify(data),
                })
              }}
              publicVars={JSON.parse(selectedAgentData.publicVariables)}
            />
          )}
      </div>
      <div
        className={`${
          selectedAgentData.publicVariables !== '[]'
            ? styles.connectorsLong
            : styles.connectors
        }`}
      >
        {pluginManager.getAgentComponents().map((value, index, array) => {
          return (
            <RenderComp
              key={index}
              element={value}
              selectedAgentData={selectedAgentData}
              setSelectedAgentData={setSelectedAgentData}
            />
          )
        })}
      </div>
    </div>
  )
}

export default AgentDetails
