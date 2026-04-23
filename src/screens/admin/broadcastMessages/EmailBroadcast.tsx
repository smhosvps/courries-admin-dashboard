"use client"

import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import {
  useCreateMessageMutation,
  useDeleteMessagesMutation,
  useGetAllMessagesQuery,
} from "@/redux/features/marketing/marketingApi"
import { Loader2, Trash2, ChevronLeft, ChevronRight, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function EmailBroadcast() {
  const { isLoading, data, refetch } = useGetAllMessagesQuery({})
  const [createMessage, { error: updateError, isSuccess: updateSuccess, isLoading: sending }] =
    useCreateMessageMutation()
  const [deleteMessages, { error: ErrorDelete, isSuccess }] = useDeleteMessagesMutation()

  const [showModal, setShowModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [selectedId, setSelectedId] = useState("")
  const [message, setMessage] = useState("")
  const [subject, setSubject] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const handleSendMessage = async () => {
    if (!subject.trim()) {
      toast.error("Subject is required")
      return
    }

    if (!message.trim()) {
      toast.error("Message is required")
      return
    }

    await createMessage({ message, subject })
  }

  const handleDelete = async () => {
    await deleteMessages(selectedId)
  }

  const resetForm = () => {
    setMessage("")
    setSubject("")
  }

  useEffect(() => {
    if (updateError && "data" in updateError) {
      toast.error((updateError as any).data.message)
    }
    if (updateSuccess) {
      refetch()
      toast.success("Email sent successfully!")
      setShowModal(false)
      resetForm()
    }
    if (isSuccess) {
      refetch()
      toast.success("Message deleted successfully")
      setDeleteModal(false)
    }
    if (ErrorDelete && "data" in ErrorDelete) {
      toast.error((ErrorDelete as any).data.message)
    }
  }, [isSuccess, ErrorDelete, updateError, updateSuccess, refetch])

  // Pagination logic
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedData = data?.slice(startIndex, endIndex) || []
  const totalPages = Math.ceil((data?.length || 0) / itemsPerPage)

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Email Broadcast</h1>

        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">New Message</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>New Message</DialogTitle>
              <DialogDescription>Compose a new email to send to all subscribers</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium leading-none">
                  Subject
                </label>
                <Input
                  id="subject"
                  placeholder="Enter email subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium leading-none">
                  Message
                </label>
                <Textarea
                  id="message"
                  placeholder="Enter your message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={6}
                  className="resize-none"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setShowModal(false)
                  resetForm()
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleSendMessage} disabled={sending} className="bg-blue-600 hover:bg-blue-700">
                {sending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Message
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead>From</TableHead>
                  <TableHead>Recipients</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y">
                {paginatedData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      No messages found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((item: any) => (
                    <TableRow key={item._id} className="hover:bg-gray-50 transition-colors">
                      <TableCell className="font-medium">{item.from}</TableCell>
                      <TableCell>{item.to}</TableCell>
                      <TableCell className="font-medium">{item.subject}</TableCell>
                      <TableCell className="max-w-xs truncate">{item.message}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(item.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </TableCell>
                      <TableCell>
                        <AlertDialog
                          open={deleteModal && selectedId === item._id}
                          onOpenChange={(open) => {
                            setDeleteModal(open)
                            if (!open) setSelectedId("")
                          }}
                        >
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-600 hover:text-red-800 hover:bg-red-50"
                              onClick={() => setSelectedId(item._id)}
                            >
                              <Trash2 className="h-5 w-5" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Message</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this message? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4 px-4 py-3 border-t">
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1} - {Math.min(endIndex, data?.length || 0)} of {data?.length || 0}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 text-sm">Page {currentPage}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={currentPage >= totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

