import { VscodeEventSource } from "@supernode/shared";


class EventSource {
    public static value: VscodeEventSource = VscodeEventSource.FILE;

    public static set(value: VscodeEventSource) {
        this.value = value;
    }
}


export default EventSource;