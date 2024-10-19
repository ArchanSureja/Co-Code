import CodeMirror, {
    Extension,
    ViewUpdate,
    scrollPastEnd,
} from "@uiw/react-codemirror"

import React, { useState, useCallback, useEffect } from 'react'
import { debounce } from 'lodash'
import { useRoom } from "../context/roomContext/roomContext"


const Editor = ({ socket, setCodeRef }) => {
    const roomContext = useRoom()
    const [code, setCode] = useState(roomContext.roomState.contents ?? "write your code here !")
    const sendCodetoWebSocket = useCallback((code) => {
        socket.emit("code-change", roomContext.roomState.roomId, code);
    }, []);
    console.log("Editor code has got this ", socket)
    useEffect(() => {
        socket.on("code-sync", (code) => {
            setCode(code)
            setCodeRef.current = code;
        })
    }, [])

    const sendCodetoWebSocket_debounce = useCallback(
        debounce((code) => {
            sendCodetoWebSocket(code);
        }, 500),
        []);
    return (
        <>
            <CodeMirror
                onChange={(code) => {
                    setCode(code)
                    sendCodetoWebSocket_debounce(code)
                    setCodeRef.current = code;
                }}
                minHeight="100%"
                maxWidth="100vw"
                style={{
                    fontSize: 14 + "px",
                    height: 85 + "vh",
                    position: "relative",
                }}
                value={code} />
        </>


    )

}
export default Editor