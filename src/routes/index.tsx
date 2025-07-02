import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Facebook, Instagram } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const [sendObjects] = useState<SendObject[]>([
    {
      socialtype: 'facebook',
      userUrl: 'https://facebook.com/john.doe',
      message: 'Hey {{firstName}}, I saw your post about {{company}} and would love to connect!'
    },
    {
      socialtype: 'instagram',
      userUrl: 'https://instagram.com/jane_smith',
      message: 'Hi {{firstName}}, your content on {{company}} is amazing. Let\'s collaborate!'
    },
    {
      socialtype: 'facebook',
      userUrl: 'https://facebook.com/mike.johnson',
      message: 'Hello {{firstName}}, interested in discussing opportunities at {{company}}.'
    },
    {
      socialtype: 'instagram',
      userUrl: 'https://instagram.com/sarah_wilson',
      message: 'Hi there! Love your work at {{company}}. Would you be open to a quick chat?'
    },
    {
      socialtype: 'facebook',
      userUrl: 'https://facebook.com/alex.brown',
      message: 'Hey {{firstName}}, your expertise in {{company}} caught my attention!'
    }
  ])

  const getSocialIcon = (socialtype: 'facebook' | 'instagram') => {
    return socialtype === 'facebook' ? <Facebook className="w-3 h-3" /> : <Instagram className="w-3 h-3" />
  }

  const getSocialColor = (socialtype: 'facebook' | 'instagram') => {
    return socialtype === 'facebook' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' : 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300'
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Outreach Messages
            </CardTitle>
            <p className="text-muted-foreground">
              Manage your multichannel prospecting automation messages
            </p>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Platform</TableHead>
                  <TableHead className="w-[300px]">User Profile</TableHead>
                  <TableHead>Message Template</TableHead>
                  <TableHead className="w-[100px]">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sendObjects.map((sendObj, index) => (
                  <TableRow key={index} className="group hover:bg-muted/30">
                    <TableCell>
                      <Badge 
                        variant="secondary" 
                        className={`${getSocialColor(sendObj.socialtype)} font-medium`}
                      >
                        <span className="mr-1">{getSocialIcon(sendObj.socialtype)}</span>
                        {sendObj.socialtype.charAt(0).toUpperCase() + sendObj.socialtype.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <a 
                          href={sendObj.userUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline font-medium truncate max-w-[250px]"
                        >
                          {sendObj.userUrl}
                        </a>
                        <span className="text-xs text-muted-foreground">
                          Profile URL
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-md">
                        <p className="text-sm leading-relaxed text-foreground/90 line-clamp-2">
                          {sendObj.message}
                        </p>
                        {sendObj.message.includes('{{') && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {sendObj.message.match(/\{\{[\w\s]+\}\}/g)?.map((variable, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {variable}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="default" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300">
                        Ready
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {sendObjects.length === 0 && (
              <div className="text-center py-12">
                <div className="text-muted-foreground">
                  <div className="text-4xl mb-4">📝</div>
                  <h3 className="text-lg font-medium mb-2">No messages yet</h3>
                  <p className="text-sm">Start by creating your first outreach message template.</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
