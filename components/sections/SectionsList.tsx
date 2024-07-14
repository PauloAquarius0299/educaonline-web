import { Section } from "@prisma/client";
import {
    DragDropContext,
    Droppable,
    Draggable,
    DropResult,
} from '@hello-pangea/dnd';
import { useState, useEffect } from "react";
import { Grip, Pencil } from "lucide-react";

interface SectionListProps {
    items: Section[];
    onReorder: (updateData: { id: string; position: number }[]) => void;
    onEdit: (id: string) => void;
}

const SectionsList = ({ items, onReorder, onEdit }: SectionListProps) => {
    const [isMounted, setIsMounted] = useState(false);
    const [sections, setSections] = useState(items);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        setSections(items);
    }, [items]);

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        const updatedItems = Array.from(sections);
        const [reorderedItem] = updatedItems.splice(result.source.index, 1);
        updatedItems.splice(result.destination.index, 0, reorderedItem);

        setSections(updatedItems);

        const bulkUpdateData = updatedItems.map((section, index) => ({
            id: section.id,
            position: index,
        }));

        onReorder(bulkUpdateData);
    };

    if (!isMounted) return null;

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="sections">
                {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}
                    className={`${sections.length > 0 ? "my-10" : "mt-7"} flex flex-col gap-5`}
                    >
                        {sections.map((section, index) => (
                            <Draggable key={section.id} draggableId={section.id} index={index}>
                                {(provided) => (
                                    <div
                                    {...provided.draggableProps}
                                    ref={provided.innerRef}
                                    className='flex items-center bg-[#ebebff] rounded-lg text-sm font-medium p-3' 
                                    >
                                        <div {...provided.dragHandleProps}>
                                            <Grip className='h-4 w-4 cursor-pointer mr-4 hover:text-[#0e60cc]' />
                                        </div>
                                        {section.title}
                                        <div className='ml-auto'>
                                            <Pencil className='h-4 w-4 cursor-pointer hover:text-[#0e60cc]'
                                            onClick={() => onEdit(section.id)}
                                            />
                                        </div>
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
};

export default SectionsList;
