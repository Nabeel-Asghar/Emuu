import { Button, Snackbar } from '@mui/material'
import { useState } from 'react'
import FacebookIcon from "@material-ui/icons/Facebook"
import TwitterIcon from "@material-ui/icons/Twitter"
import LinkIcon from "@material-ui/icons/Link"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import ListItemText from "@material-ui/core/ListItemText"
import Paper from "@material-ui/core/Paper"


const CopyToClipboardButton = () => {
    const handleShare = e => {
        e.preventDefault()

        const ahref = window.location.href
        const encodedAhref = encodeURIComponent(ahref)
        var link

        switch (e.currentTarget.id) {
          case "facebook":
            link = `https://www.facebook.com/sharer/sharer.php?u=${ahref}`
            open(link)
            break

          case "twitter":
            link = `https://twitter.com/intent/tweet?url=${encodedAhref}`
            open(link)
            break

          case "copy":
            navigator.clipboard.writeText(ahref)
            break

          default:
            break
        }
      }

      const open = socialLink => {
        window.open(socialLink, "_blank")
      }

      const flexContainer = {
        display: 'flex',
        flexDirection: 'row',
        float:"left",
        borderRadius: "12px",
        color:"#fff",
    justifyContent:"center"
    ,textAlign:"center",
    alignItems:"center",
    marginRight:"10px",
        
          backgroundColor: "rgba(126, 121, 121, 0.3)",
          padding: "3px",
      };
    const whiteIcon = {
    color:"white"}
    return (

                <List  style={flexContainer}>
                    <ListItem  sx={{padding:"5px"}}button  id="facebook" onClick={handleShare}>
                        <ListItemIcon style={whiteIcon}>
                            <FacebookIcon  style={whiteIcon}onClick={handleShare} />
                        </ListItemIcon>
                       
                    </ListItem>
                    <ListItem sx={{padding:"5px"}}button  id="twitter" onClick={handleShare}>
                        <ListItemIcon>
                            <TwitterIcon style={whiteIcon}/>
                        </ListItemIcon>
                      
                    </ListItem>
                    <ListItem sx={{padding:"5px"}}button  id="copy" onClick={handleShare}>
                        <ListItemIcon>
                            <LinkIcon style={whiteIcon}/>
                        </ListItemIcon>
                       
                    </ListItem>
                </List>
                

                

    )
}

export default CopyToClipboardButton
